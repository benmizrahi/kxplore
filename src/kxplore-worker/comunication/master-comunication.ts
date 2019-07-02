import { Injectable, Inject } from "@decorators/di";
import * as io from 'socket.io-client';
import * as socket from 'socket.io'

import { IJobInformation } from "../../kxplore-shared-models/job-details";
import { matchPatten } from "../handlers/consumers/IConsumer";
import { EventEmitter } from "events";

@Injectable()
export class MasterCommunication {
    
    constructor(@Inject('global-config') private config: any){}
    private readonly active = {}
    //uuid = server id~
    start = (uuid:string)=>{
        
        var socket = io.connect(`http://${process.env.MASTER_HOST}/workers?uuid=${uuid}`, { reconnect: true});
        
        
        /*
            On post new job start the traget component!
        */
        socket.on('NEW_JOB', async (jobData:IJobInformation) => {
            this.active[jobData.uuid] = matchPatten(jobData.env);
            console.log(`worker_id:${process.env.WORKER_ID}, uuid: ${uuid} retrive job: ${JSON.stringify(jobData)}`);
            let emiter:EventEmitter = await this.active[jobData.uuid].start(jobData);
           
            emiter.on(`JOB_DATA_${jobData.uuid}`,(data)=>{
                socket.emit(`JOB_DATA_${jobData.uuid}`,data);
                //console.debug(`worker: ${uuid}, ${process.env.WORKER_ID} is publishing data: ${JSON.stringify(new Date())}`)
            })
            /*
                On delete jon stop the component!
            */
            socket.on(`DELETE_${jobData.uuid}`, async () => {
                console.log(`DELETE event triggred on worker ${process.env.WORKER_ID} - job: ${jobData.uuid}`)
                await this.active[jobData.uuid].stop(jobData);
                delete this.active[jobData.uuid];
            });
        });

        socket.on('disconnect', (ex)=> {
            console.error(`Worker disconnected workerid:${uuid}, error:  ${JSON.stringify(ex)}`)
            console.info(`Start stoping all active jobs, count ${Object.keys(this.active).length}`)
            Object.keys(this.active).map((job)=>{
                this.active[job].stop();
                console.info(`job ${job} stoped!`);
            })
        });
    }

}