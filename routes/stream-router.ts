'use strict';
import * as socket from 'socket.io'
import * as jwt from 'jsonwebtoken'
import { Injectable, Inject } from '@decorators/di';
import { ILoggerHandler } from '../handlers/loggerHandler';
import { IHandler, IHandlerResults } from '../interfaces/IHandler';
import { LoggerAction, KafkaAction } from '../interfaces/enums';
import { KafkaHandler } from '../handlers/kafkaHandler';

@Injectable()
export class StreamRouter {
   
    constructor(@Inject('global-config') private config: any,
    @Inject(ILoggerHandler) private readonly logger:IHandler<LoggerAction>,
    @Inject(KafkaHandler) private readonly kafkaHandler:KafkaHandler) {
    
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

           const connections = new Map();
           client.on('start-consumer', async (data) => {
                try {
                    let handler:IHandlerResults<KafkaAction> = await this.kafkaHandler.handle({action:KafkaAction.connect,payload:{
                        env:data.env,   
                        topic:data.topic,
                        timestamp:data.timestamp,
                        userId:client.decoded,
                        dataCallback:this.publishdata(client,data,io)
                    }})
                    let current = data;
                    current['id'] = handler.results
                    var clientValues = connections.get(client);
                    if(clientValues){
                        clientValues.push(current)
                    }else{
                        clientValues = []
                        clientValues.push(current)
                    }
                    connections.set(client,clientValues);
                    console.log(`createdclient id = ${handler.results}`)
                    client.emit(`akk-consumer-id-${data.topic}-${data.env}`, {id:handler.results});
                }
                catch(e){
                    
                }
            });

           client.on('stop-consumer', async (data) => {
               let res = await this.kafkaHandler.handle({action:KafkaAction.disconnect,payload:{
                    env:data.env,
                    topic:data.topic,
                    id:data.id
                }})
                let clientValues = connections.get(client);
                connections.set(client,clientValues.filter(x =>{
                    return x.id != data.id 
                }));
           });

           client.on('disconnect',async () => {
                let clientValues = connections.get(client);
                if(!clientValues) return;
                clientValues.forEach(async (clientConnections) => {
                    let res = await this.kafkaHandler.handle({action:KafkaAction.disconnect,payload:{
                        env:clientConnections.env,
                        topic:clientConnections.topic,
                        id:clientConnections.id
                    }}) 
                    console.log(`deconnected from" ${clientConnections.topic}-${clientConnections.env}`)
                });
               connections.delete(client); //delete the client
           });

           client.on('discribe-env',async (data)=>{
            let res = await this.kafkaHandler.handle({action:KafkaAction.describe,payload:{
                env:data.env
            }})
            client.emit(`discribe-env-results`, res);
           })

           client.on('start-consumer-by-timestamp',async (data)=>{
            let res = await this.kafkaHandler.handle({action:KafkaAction.fatchFromTimestamp,payload:{
                env:data.env,
                topic:data.topic
            }})
            client.emit(`start-consumer-by-timestamp-results`, res);
           })
      });
    };

    private publishdata = (client,data,io) => {
         return (message) => {
            io.emit(`messages-list-${data.topic}-${data.env}`, {topic:data.topic,env:data.env,messages:message});
        }
    }
}
