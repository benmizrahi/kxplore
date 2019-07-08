'use strict';
import * as socket from 'socket.io'
import * as jwt from 'jsonwebtoken'
import { Injectable, Inject } from '@decorators/di';
import { CommunicationHandler } from '../handlers/communication-handler';
import {ConnectionObject } from '../../../kxplore-shared-models/connection-object'
/*
    Duplicated from the client side - this object is the main object transfered from client to server!
*/

@Injectable()
export class StreamRouter {
   
    constructor(@Inject('global-config') private config: any,
                @Inject(CommunicationHandler) private readonly communicationHandler: CommunicationHandler) {
    
    }   

    register = (server) => {
        const io = socket(server);
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

           client.on('consumer-connect', async (params:{connectionObject:ConnectionObject}) => {
               const data = Object.assign(new ConnectionObject(),params.connectionObject) ;
               data.uId =client.decoded;
               try {
                    let job_uuid = await this.communicationHandler.createNewJob(data)
                    clientActiveJobs[job_uuid] = await this.communicationHandler.createJobIDSocket(job_uuid,this.publishdata(io,data))
                    console.log(`created client id = ${job_uuid}`)   
                    client.emit(`akk-consumer-id-${data.getStreamingKey()}`, {id:job_uuid});
               }
               catch(e){
                    client.emit(`consumer-id-${data.getStreamingKey()}-error`, e);
               }
            });

           client.on('pause', async (params:{connectionObject:ConnectionObject}) => {
            const data = Object.assign(new ConnectionObject(),params.connectionObject) ;

             try{
                if(clientActiveJobs[data.job_id]){
                    clientActiveJobs[data.job_id].emit(`STOP_JOB_${data.job_id}`)
                    delete clientActiveJobs[data.job_id];
                }
            }
            catch(ex){
                console.log(`error while filtering userId ${client.id} -- connection dosn't exsits`)
            }
           });
           
           client.on('resume',async (data) =>{
               
           });

           client.on('delete',async (params:{connectionObject:ConnectionObject}) => {
            const data = Object.assign(new ConnectionObject(),params.connectionObject) ;
               if(clientActiveJobs[data.job_id]){
                clientActiveJobs[data.job_id].emit(`STOP_JOB_${data.job_id}`)
                delete clientActiveJobs[data.job_id];
               }
           });

           client.on('disconnect',async () => {
                Object.keys(clientActiveJobs).map((job_uuid) => {
                    clientActiveJobs[job_uuid].emit(`STOP_JOB_${job_uuid}`)
                    delete clientActiveJobs[job_uuid];
                })
           });

           client.on('discribe-env',(params:{connectionObject:ConnectionObject}) => {
            const data = Object.assign(new ConnectionObject(),params.connectionObject) ;
               
           })
      });
    };

    private publishdata = (io,connectionObject:ConnectionObject) => {
         return (message) => {
            io.emit(`messages-list-${connectionObject.getStreamingKey()}`, {topic:connectionObject.topic,connectionObject:connectionObject.env,messages:message});
        }
    }
}
