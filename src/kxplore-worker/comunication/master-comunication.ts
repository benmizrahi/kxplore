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
        
        var socket = io.connect("http://localhost:3001/workers?uuid=" + uuid, { reconnect: true });
        
        socket.on('NEW_JOB', async (data:IJobInformation) => {
            console.log("worker_id " + uuid + " - data: " + JSON.stringify(data));
            let emiter:EventEmitter = await matchPatten(data.env).start(data);
            emiter.on('DATA',(data)=>{
                socket.emit(`JOB_DATA_${data.uuid}`,data);
            })
        });

        socket.on('disconnect', function (ex) {
           
        });
    }

}