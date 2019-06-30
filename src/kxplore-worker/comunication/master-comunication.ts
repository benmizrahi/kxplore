import { Injectable, Inject } from "@decorators/di";
import * as io from 'socket.io-client';
import * as socket from 'socket.io'

import { IJobInformation } from "../../kxplore-shared-models/job-details";
import { matchPatten } from "../handlers/consumers/IConsumer";
import { EventEmitter } from "events";

@Injectable()
export class MasterCommunication {
    
    constructor(@Inject('global-config') private config: any){}

    //uuid = server id~
    start = (uuid:string)=>{
        
        var socket = io.connect(`http://${process.env.MASTER_HOST}/workers?uuid=${uuid}`, { reconnect: true});
        
        socket.on('NEW_JOB', async (jobData:IJobInformation) => {
            console.log("worker_id " + uuid + " - data: " + JSON.stringify(jobData));
            let emiter:EventEmitter = await matchPatten(jobData.env).start(jobData);
            emiter.on('NEW_DATA',(data)=>{
                socket.emit(`JOB_DATA_${jobData.uuid}`,data);
                console.debug(`worker publishing data...`)
            })
        });

        socket.on('disconnect', function (ex) {
            console.error(`Worker disconnected ${JSON.stringify(ex)}`)
        });
    }

}