'use strict';
import * as socket from 'socket.io'
import * as jwt from 'jsonwebtoken'
import { Injectable, Inject } from '@decorators/di';
import { CommunicationHandler } from '../handlers/communication-handler';


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

           client.on('consumer-connect', async (data) => {
               try {
                    let job_uuid = await this.communicationHandler.createNewJob(data.env,data.topic,client.decoded,data.isOldest ? 'earliest' : 'latest',)
                    clientActiveJobs[job_uuid] = await this.communicationHandler.createJobIDSocket(job_uuid,this.publishdata(client,data,io))
                    console.log(`created client id = ${job_uuid}`)   
                    client.emit(`akk-consumer-id-${data.topic}-${data.env}`, {id:job_uuid});
               }
               catch(e){
                    client.emit(`consumer-id-${data.topic}-${data.env}-error`, e);
               }
            });

           client.on('pause', async (data) => {
             try{
                if(clientActiveJobs[data.id]){
                    clientActiveJobs[data.id].emit(`STOP_JOB_${data.id}`)
                    delete clientActiveJobs[data.id];
                }
            }
            catch(ex){
                console.log(`error while filtering userId ${client.id} -- connection dosn't exsits`)
            }
           });
           
           client.on('resume',async (data) =>{
           });

           client.on('delete',async (data) =>{
               if(clientActiveJobs[data.id]){
                clientActiveJobs[data.id].emit(`STOP_JOB_${data.id}`)
                delete clientActiveJobs[data.id];
               }
           });

           client.on('disconnect',async () => {
                Object.keys(clientActiveJobs).map((job_uuid) => {
                    clientActiveJobs[job_uuid].emit(`STOP_JOB_${job_uuid}`)
                    delete clientActiveJobs[job_uuid];
                })
           });

           client.on('discribe-env',async (data)=>{ 
               
           })
      });
    };

    private publishdata = (client,data,io) => {
         return (message) => {
            io.emit(`messages-list-${data.topic}-${data.env}`, {topic:data.topic,env:data.env,messages:message});
        }
    }
}
