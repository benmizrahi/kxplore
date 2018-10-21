import { IHandler, IHandlerAction, IHandlerResults } from "../interfaces/IHandler";
import { KafkaAction, LoggerAction, DBAction } from "../interfaces/enums";
import { Inject, Injectable } from "@decorators/di";
import * as kafka from 'kafka-node'
import { ILoggerHandler } from "./loggerHandler";
import { clearInterval } from "timers";
import { IDbHandler } from "./dbHandler";
import { ConsumerWapper } from "../services/utilities/kafka/consumerWapper";
const kafkaLogging = require('kafka-node/logging');
kafkaLogging.setLoggerProvider(consoleLoggerProvider);
function consoleLoggerProvider (name) {
    // do something with the name
    return {
      debug: console.debug.bind(console),
      info: console.info.bind(console),
      warn: console.warn.bind(console),
      error: console.error.bind(console)
    };
  }


@Injectable()
export class KafkaHandler implements IHandler<KafkaAction>{
    
    private connections:{ [env: string]: {topics: { [topic:string]:{instance:ConsumerWapper, pool:Array<any>,interval:any,reconnect:boolean,filter:string,callbacks:{[id:string]: Function }}  } } } = { };

    private envierments:{[env:string]:any} = null


    constructor(@Inject('global-config') private readonly config:{kafkaConfig:{messagePool:number,minMessage:number,intervalMs:number,poolCount:number}},
             @Inject(ILoggerHandler) private readonly logger:IHandler<LoggerAction>,
            @Inject(IDbHandler) private readonly dbHandler:IHandler<DBAction>){
             }

    handle(handleParams: IHandlerAction<KafkaAction>): Promise<IHandlerResults<KafkaAction>> {
        return  new Promise(async(resolve, reject)=>{

            if(!this.envierments) await this.initEnvs(); 

            switch(handleParams.action){
                case KafkaAction.connect:
                    try {
                        let from_offset = null

                        if(handleParams.payload.timestamp){
                            //describe to topic number of partitons
                            const topicDescription =  await this.handle({action:KafkaAction.describe,payload:handleParams.payload})
                            from_offset = await this.getOffsetByTimestamp(handleParams.payload.env,
                                handleParams.payload.topic,handleParams.payload.userId,Object.keys(topicDescription.results[1].metadata[handleParams.payload.topic]),handleParams.payload.timestamp)
                        }else if(handleParams.payload.oldest){
                            from_offset = await this.getOldestOffsets(handleParams.payload.env,
                                handleParams.payload.topic,handleParams.payload.userId) //fatch the latest 
                        }else{
                            from_offset = await this.getLatestOffsets(handleParams.payload.env,
                                handleParams.payload.topic,handleParams.payload.userId) //fatch the latest 
                        }
                
                        const id = await this.initKafka(handleParams.payload,from_offset)  //init kafka consumet
                        console.info(`instnace of ${JSON.stringify(handleParams.payload)} created sucssesfully!`) 
                        resolve({status:true,action:handleParams.action,results:id})
                    }
                    catch(e) {reject(e) };
                    break;
                case KafkaAction.disconnect:
                    try {
                            delete this.connections[handleParams.payload.env].topics[handleParams.payload.topic].callbacks[handleParams.payload.id]
                            console.info(`connection stop ! payload ${JSON.stringify(handleParams.payload)}`);
                            console.log(`deel client id = ${handleParams.payload.id}`)
                            resolve({status:true,action:handleParams.action});
                    }
                    catch(e) {reject(e) };
                    break;
                case KafkaAction.applyFilter:
                        console.log(`applying filter ${JSON.stringify(handleParams.payload)}`)
                        this.applyFilter(handleParams.payload)
                        resolve({status:true,action:handleParams.action});
                break;
                case KafkaAction.describe:
                    const client = new kafka.Client(this.envierments[handleParams.payload.env]['zookeeperUrl'] + '/');
                    client.once('connect', function () {
                        client.loadMetadataForTopics([], function (error, results) {
                          if (error) {
                              return console.error(error);
                          }
                          resolve({status:true,action:handleParams.action,results:results});
                        });
                    });
                break;
                case KafkaAction.fatchFromTimestamp:
                    let results = await this.handle({action:KafkaAction.describe,payload:{env:handleParams.payload.env}})
                    let partitons =  Object.keys(results.results[1].metadata[handleParams.payload.topic])
                    let actionResults = await  this.getOffsetsInTimeStamp(handleParams.payload.env,handleParams.payload.topic,partitons,handleParams.payload.timestamp)
                    let reset  = await this.setPartitonsOffsets(handleParams.payload.env,handleParams.payload.topic,actionResults,handleParams.payload.userId)
                    resolve({status:true,action:handleParams.action,results:reset});
                break;
                case KafkaAction.reloadEnvierment:
                 await this.initEnvs(); 
                 resolve({status:true,action:handleParams.action});
                break;
            }
        });
    }
    
    private applyFilter({env,topic,filter}){
        this.connections[env].topics[topic].filter = filter;
    }

    private initKafka = ({env,topic,userId,dataCallback},offsets?) =>{
        return  new Promise<string>((resolve,reject)=>{
            const id = this.guid()
            if(this.connections[env] && this.connections[env].topics[topic] &&  this.connections[env].topics[topic].instance) {
                this.connections[env].topics[topic].callbacks[id] = dataCallback
                this.handlePoolMessages([],this.connections[env].topics[topic].instance,{env:env,topic:topic})
                if(!this.connections[env].topics[topic].instance.isActive 
                 && this.connections[env].topics[topic].pool.length == 0 ){
                    this.connections[env].topics[topic].instance.resume();
                }
                resolve(id)
                return;
            }
            let kafkaConfig =  this.envierments[env];
            const consumer = new ConsumerWapper();
            consumer.consume<any>(topic,env,kafkaConfig['zookeeperUrl'],kafkaConfig['groupId'] + '___' + userId,
             4,this.envierments[env].properties,offsets,this.topicMessageHandler,this);

                if(!this.connections[env])
                    this.connections[env] = { topics:{} }
    
                if(!this.connections[env].topics[topic])
                    this.connections[env].topics[topic] = {instance:consumer, pool:[],interval:null,reconnect:false,filter:null,callbacks: {}};
            
                this.connections[env].topics[topic].callbacks[id] = dataCallback
                console.log("Started consumer successfully");
                resolve(id)
            //})
       });
    }

    async topicMessageHandler (message: any,topic:string,env:string, done: Function,context:any): Promise<void> {
        //console.info(`Got message ` + JSON.stringify(message));
        context.handlePoolMessages([message],context.connections[env].topics[topic].instance,{topic,env})
       // handler code here
       return done();
    }

    private handlePoolMessages = (msgs:Object[],instance:ConsumerWapper, {env,topic}) =>{
        this.connections[env].topics[topic].pool  = this.connections[env].topics[topic].pool.concat(msgs)
        if(this.connections[env].topics[topic].pool.length > this.config.kafkaConfig.messagePool
         && this.connections[env].topics[topic].instance.isActive){
             console.log(`pool is full stoping consumer!`)
             this.connections[env].topics[topic].instance.pause()
        }
        if(!this.connections[env].topics[topic].interval){
             console.log(`creating interval...`)
             this.connections[env].topics[topic].interval = setInterval(()=>{
             let clients = Object.keys(this.connections[env].topics[topic].callbacks)
             if(clients.length == 0) {
                console.log(`no listeners found clearing interval...`)
                clearInterval(this.connections[env].topics[topic].interval);
                this.connections[env].topics[topic].interval = null;
                this.connections[env].topics[topic].instance.pause()
             } 
             clients.forEach(x => {
                 if(this.connections[env].topics[topic].callbacks[x])
                 this.connections[env].topics[topic].callbacks[x](this.connections[env].topics[topic].pool.splice(0, this.config.kafkaConfig.poolCount))
             })
            if(this.connections[env].topics[topic].pool.length < this.config.kafkaConfig.minMessage
                && !this.connections[env].topics[topic].instance.isActive){
                console.log(`pool is empty restrating consumer...`)
                this.connections[env].topics[topic].instance.resume()
            }},this.config.kafkaConfig.intervalMs)
        }
    }

    private initEnvs = async () => {
        let db = await this.dbHandler.handle({action:DBAction.executeSQL,payload:
            `select envName,props from dim_envierments`})
        this.envierments = {}
        db.results.forEach(row => {
            this.envierments[row.envName] = JSON.parse(row.props)
        });
    }

    guid() {
        function s4() {
          return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }

    private getOffsetByTimestamp = (env,topic,userId,partitons,time) => {
        return new Promise<boolean>((resolve,reject)=>{
            console.log(this.envierments[env]['groupId'] + '___' + userId)
            let client = new kafka.Client(this.envierments[env].zookeeperUrl,this.envierments[env]['groupId'] + '___' + userId);
            var offset = new kafka.Offset(client)
            offset.fetch( partitons.map(x=>{
                return { topic: topic, partition: x, time:time , maxNum: 1 }
            }), (err, data) => {
                if(err){
                    reject(`error geting offset by ts ${err}`)
                }
                else{
                    let isValid = true;
                    Object.keys(data[topic])
                    .forEach(partition => {
                       isValid =  data[topic][partitons] != 0
                    })
                    if(isValid)
                        resolve(data)
                    else{
                        reject({error:`date time not found in kafka!`,errorCode:1});
                    }
                }
            });
        });
    }

    private getLatestOffsets = (env,topic,userId) => {
        return new Promise<boolean>((resolve,reject)=>{
            console.log(this.envierments[env]['groupId'] + '___' + userId)
            let client = new kafka.Client(this.envierments[env].zookeeperUrl,this.envierments[env]['groupId'] + '___' + userId);
            var offset = new kafka.Offset(client)
            offset.fetchLatestOffsets( [topic] , (err, data) => {
                    if(err){
                        console.error(err);
                        reject(err)
                    }else{
                        resolve(data)
                    }
            });
        })
    }

    private getOldestOffsets = (env,topic,userId) => {
        return new Promise<boolean>((resolve,reject)=>{
            console.log(this.envierments[env]['groupId'] + '___' + userId)
            let client = new kafka.Client(this.envierments[env].zookeeperUrl,this.envierments[env]['groupId'] + '___' + userId);
            var offset = new kafka.Offset(client)
            offset.fetchEarliestOffsets( [topic] , (err, data) => {
                    if(err){
                        console.error(err);
                        reject(err)
                    }else{
                        resolve(data)
                    }
            });
        })
    }

    private getOffsetsInTimeStamp =  (env,topic,partitons,timestamp) => {
        return new Promise<boolean>((resolve,reject)=>{
            let client = kafka.Client(this.envierments[env]['zookeeperUrl'] + '/');
            var offset = new kafka.Offset(client)
            offset.fetch( partitons.map(x=>{
                return { topic: topic, partition: x, time:timestamp, maxNum: 1 }
            }), (err, data) => {
                    if(err){
                        console.error(err);
                        reject(err)
                    }else{
                        resolve(data)
                    }
            });
        })
    }

    private setPartitonsOffsets = (env,topic,offsets,userId) =>{
        return new Promise<boolean>((resolve,reject)=>{
            let client = kafka.Client(this.envierments[env]['zookeeperUrl'] + '/');
            var offset = new kafka.Offset(client)
            offset.commit(this.envierments[env]['groupId'] + '_' + userId ,
                Object.keys(offsets[topic]).map(x=>{
                    return {
                        topic:topic,
                        partition:x,
                        offset:offsets[topic][x][0]
                    }
                }), function (err, data) {
                    console.log(`offsets commited: ${JSON.stringify(data)}`)
                    resolve(true);
            });
    })
}

}

process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE')
         console.log("error");
    else
         console.log(err);
});   
process.on('SIGINT', () => process.exit());