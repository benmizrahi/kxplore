'use strict';
import * as socket from 'socket.io'
import * as jwt from 'jsonwebtoken'
import { Injectable, Inject } from '@decorators/di';
import { IHandler } from '../interfaces/IHandler';
import { LoggerAction } from '../interfaces/enums';
import { CommunicationHandler } from '../handlers/communication-handler';


@Injectable()
export class StreamRouter {
   
    constructor(@Inject('global-config') private config: any,
                @Inject(CommunicationHandler) private readonly communicationHandler: CommunicationHandler) {
    
    }   

    register = (server) => {
        const redisAdapter = require('socket.io-redis');
        const io = socket(server);
        io.adapter(redisAdapter({ host: this.config['redis-config']['host'], port: this.config['redis-config']['port'] }));
        io.use((socket, next) => {
            if (socket.handshake.query && socket.handshake.query.token){
                jwt.verify(socket.handshake.query.token, this.config.authConfig['SECRET_KEY'], function(err, decoded) {
                    if(err) return next(new Error('Authentication error'));
                    socket.decoded = decoded;
                    next();
                });
            } else {
                next(new Error('Authentication error'));
            }
        });
        this.socketIntHanlder(this.config,io)
    }
    
    private socketIntHanlder = (config,io) => {
        io.on('connection', (client) => {   
            
         const clientActiveJobs = {};

           client.on('consumer-connect', async (data) => {
               try {
                    let job_uuid = await this.communicationHandler.createNewJob(data.env,data.topic)
                    this.communicationHandler.createJobIDSocket(job_uuid,this.publishdata(client,data,io))
                    console.log(`created client id = ${job_uuid}`)   
                    client.emit(`akk-consumer-id-${data.topic}-${data.env}`, {id:job_uuid});
                    
               }
               catch(e){
                     client.emit(`consumer-id-${data.topic}-${data.env}-error`, e);
               }
            });

           client.on('pause', async (data) => {
             try{
                // let res = await this.kafkaHandler.handle({action:KafkaAction.pause,payload:{
                //     env:data.env,
                //     topic:data.topic,
                //     userId:client.decoded,
                //     id:data.id
                // }})
                // if(connections[client.id])
                // connections[client.id] =  connections[client.id].filter(keys =>{
                //     return keys.topic == data.topic && keys.env == data.env
                // });
            }
            catch(ex){
                console.log(`error while filtering userId ${client.id} -- connection dosn't exsits`)
            }
           });
           
           client.on('resume',async (data) =>{
                // let res = await this.kafkaHandler.handle({action:KafkaAction.resume,payload:{
                //     env:data.env,
                //     topic:data.topic,
                //     userId:client.decoded,
                //     id:data.id
                // }})      
                // if(!connections[client.id]){
                //     connections[client.id] = []
                // }
                // connections[client.id].push({env:data.env,topic:data.topic})
           });

           client.on('delete',async (data) =>{
            // connections[client.id] = connections[client.id].filter(keys =>{
            //     return keys.topic == data.topic && keys.env == data.env
            // });
            // let res = await this.kafkaHandler.handle({action:KafkaAction.clear,payload:{
            //     env:data.env,
            //     topic:data.topic,
            //     userId:client.decoded,
            //     id:data.id
            // }})  
           });

           client.on('disconnect',async () => {
                // if(!connections[client.id] || connections[client.id].length == 0) return;
                // connections[client.id].forEach(async (clientConnections) => {
                //     let res = await this.kafkaHandler.handle({action:KafkaAction.clear,payload:{
                //         env:clientConnections.env,
                //         topic:clientConnections.topic,
                //         userId:client.decoded
                //     }}) 
                //     console.log(`deconnected from" ${clientConnections.topic}-${clientConnections.env}`)
                // });
                // connections[client.id] = [] //delete the client
           });

           client.on('discribe-env',async (data)=>{
            // let res = await this.kafkaHandler.handle({action:KafkaAction.describe,payload:{
            //     env:data.env
            // }})
            // client.emit(`discribe-env-results`, res);
           })
      });
    };

    private publishdata = (client,data,io) => {
         return (message) => {
            io.emit(`messages-list-${data.topic}-${data.env}`, {topic:data.topic,env:data.env,messages:message});
        }
    }
}
