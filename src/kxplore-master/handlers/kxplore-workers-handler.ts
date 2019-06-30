import { Injectable } from "@decorators/di";
import * as socket from 'socket.io'
import { IJobInformation } from "../../kxplore-shared-models/job-details";
import {EventEmitter } from 'events';

@Injectable()
export class KxploreWorkersHandler{

    private readonly activeJobs:{ [uuid: string] : EventEmitter } = {}
    private readonly activeWorkers:{ [uuid: string] : { socket:socket.Socket,activeJobs:IJobInformation[] }; } = {}

    connect = (uuid:string,socket:socket.Socket) => {
        this.activeWorkers[uuid] = {socket:socket,activeJobs:[]};
        let publish:{ [jobId: string]:IJobInformation } = {};
        Object.keys(this.activeWorkers).filter(x=>x != uuid).
            map(worker=>{
                if(this.activeWorkers[worker].activeJobs.length > 0){
                    this.activeWorkers[worker].activeJobs.map(job=>{
                        if(!publish[job.uuid]){
                            publish[job.uuid] = job;
                        }
                    })
                }
        })  
        if(Object.keys(publish).length > 0){
            Object.keys(publish).map(jobToPublish=>{
                this.activeWorkers[uuid].socket.emit('NEW_JOB',publish[jobToPublish]);
                this.activeWorkers[uuid].activeJobs.push(publish[jobToPublish]); 
            })
        }
    }

    subscribe = (uuid:string):EventEmitter => {
        return this.activeJobs[uuid];
    }

    disconnect = (uuid:string) =>{
        if(this.activeWorkers[uuid]){
            delete this.activeWorkers[uuid] //delete the worker!
        }
    }

    publishJob = (jobInfo:IJobInformation)=>{
        this.activeJobs[jobInfo.uuid] = new EventEmitter();
        Object.keys(this.activeWorkers).map(worker=>{
            this.activeWorkers[worker].socket.emit('NEW_JOB',jobInfo);
            this.activeWorkers[worker].activeJobs.push(jobInfo); //push the job executing in each worker!           
            this.activeWorkers[worker].socket.on(`JOB_DATA_${jobInfo.uuid}`,( data:{messages:Array<any>,uuid:string})=>{
                //on data from worker!
                console.debug(`master retrive data from worker ${worker}...`)
                this.activeJobs[jobInfo.uuid].emit('NEW_DATA',data)
            })
        })
    }

    stopJob = (jobInfo:IJobInformation) => {
        Object.keys(this.activeWorkers).map(worker=>{
            let index = this.activeWorkers[worker].activeJobs.indexOf(jobInfo)
            if(index > -1){
                this.activeWorkers[worker].socket.emit('DELETE',jobInfo);//tell the worker to stop!
                this.activeWorkers[worker].activeJobs.splice(index, 1); //removes the job from active jobs!
            }
        });
        this.activeJobs[jobInfo.uuid].removeAllListeners()
        delete this.activeJobs[jobInfo.uuid]
    }

}