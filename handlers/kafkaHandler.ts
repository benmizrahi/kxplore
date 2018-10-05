import { IHandler, IHandlerAction, IHandlerResults } from "../interfaces/IHandler";
import { KafkaAction, LoggerAction, DBAction } from "../interfaces/enums";
import { Inject, Injectable } from "@decorators/di";
import * as kafka from 'kafka-node'
import { ILoggerHandler } from "./loggerHandler";
import { clearInterval } from "timers";
import { IDbHandler } from "./dbHandler";
import { Consumer } from "../services/utilities/kafka/consumerWapper";



@Injectable()
export class KafkaHandler implements IHandler<KafkaAction>{
    
    private connections:{ [env: string]: {topics: { [topic:string]:{instance:Consumer, pool:Array<any>,interval:any,reconnect:boolean,filter:string,callbacks:{[id:string]: Function }}  } } } = { };

    private envierments:{[env:string]:Object} = null


    constructor(@Inject('global-config') private readonly config:{kafkaConfig:{messagePool:number,minMessage:number,intervalMs:number,poolCount:number}},
             @Inject(ILoggerHandler) private readonly logger:IHandler<LoggerAction>,
            @Inject(IDbHandler) private readonly dbHandler:IHandler<DBAction>){ }

    handle(handleParams: IHandlerAction<KafkaAction>): Promise<IHandlerResults<KafkaAction>> {
        return  new Promise(async(resolve, reject)=>{

            if(!this.envierments) await this.initEnvs(); 

            switch(handleParams.action){
                case KafkaAction.connect:
                    try {
                        const id = await this.initKafka(handleParams.payload)
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
                    resolve({status:true,action:handleParams.action,results:actionResults});
                break;
            }
        });
    }
    
    private applyFilter({env,topic,filter}){
        this.connections[env].topics[topic].filter = filter;
    }

    private initKafka = ({env,topic,dataCallback}) =>{
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
            const consumer = new Consumer();
            consumer.consume<any>(topic,env,kafkaConfig['zookeeperUrl'],kafkaConfig['groupId'] + id,
             4, this.topicMessageHandler,this);

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

    private handlePoolMessages = (msgs:Object[],instance:Consumer, {env,topic}) =>{
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

    private resetConsumerOffsets = (env,topic) => {
        return new Promise<boolean>((resolve,reject)=>{
            let client = new kafka.Client(env.zookeeperUrl);
            var offset = new kafka.Offset(client)
            var consumer = new kafka.HighLevelConsumer(
                client, [
                {
                    topic:topic
                }],
                {
                    groupId: env.groupId,
                    autoCommit: false
                }
             );
            offset.fetchLatestOffsets([topic], (err, offsets) => {
                if (err) {
                    console.log(`error fetching latest offsets ${err}`)
                    reject(err);
                }else{
                    var latest = 1
                    Object.keys(offsets[topic]).forEach( o => {
                        latest = offsets[topic][o] > latest ? offsets[topic][o] : latest
                    })
                    consumer.setOffset(topic, 0, latest-1)
                }
                resolve(true)
            });

            
        })

        // let consumer = new kafka.HighLevelConsumer(
        //         consumerClient,
        //         [
        //             { topic: 'myTopic', partition: 0, fromOffset: -1 }
        //         ],
        //         {
        //             autoCommit: false
        //         }
        // );
    }

    private getOffsetsInTimeStamp =  (env,topic,partitons,timestamp) => {
        return new Promise<boolean>((resolve,reject)=>{
            let client = new kafka.Client(env.zookeeperUrl);
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

}

process.on('uncaughtException', function(err) {
    if(err.errno === 'EADDRINUSE')
         console.log("error");
    else
         console.log(err);
});   
process.on('SIGINT', () => process.exit());