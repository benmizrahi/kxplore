import { Injectable } from "@decorators/di";
import * as socket from 'socket.io'
import { IJobInformation } from "../../kxplore-shared-models/job-details";
import {EventEmitter } from 'events';

@Injectable()
export class KxploreWorkersHandler{

    private readonly activeJobs:{ [uuid: string] :  {event:EventEmitter, job:IJobInformation } } = {}
    private readonly activeWorkers:{ [uuid: string] : { socket:socket.Socket,activeJobs:IJobInformation[] }; } = {}

    connect = (uuid:string,socket:socket.Socket) => {
        let worker_state = {socket:socket,activeJobs:[]};
        Object.keys(this.activeJobs).map(job_id=>{
            worker_state.activeJobs.push(this.activeJobs[job_id].job)
            worker_state.socket.emit('NEW_JOB',this.activeJobs[job_id].job);
        })
        
        this.activeWorkers[uuid] = worker_state
        
    }

    subscribe = (uuid:string):EventEmitter => {
        return this.activeJobs[uuid].event;
    }

    disconnect = (uuid:string) =>{
        if(this.activeWorkers[uuid]){
            delete this.activeWorkers[uuid] //delete the worker!
        }
    }

    publishJob = (jobInfo:IJobInformation)=>{
        this.activeJobs[jobInfo.uuid] =  {event:new EventEmitter(),job:jobInfo};
        console.debug(`active_workers on job submit ${Object.keys(this.activeWorkers)}`)
        Object.keys(this.activeWorkers).map(worker=>{
            this.activeWorkers[worker].socket.emit('NEW_JOB',jobInfo);
            this.activeWorkers[worker].activeJobs.push(jobInfo); //push the job executing in each worker!           
            this.activeWorkers[worker].socket.on(`JOB_DATA_${jobInfo.uuid}`,( data:{messages:Array<any>,uuid:string})=>{
                //on data from worker!
                if(this.activeJobs[jobInfo.uuid]){
                    this.activeJobs[jobInfo.uuid].event.emit(`MESSAGES_${jobInfo.uuid}`,data)
                }
            })
        })
    }

    stopJob = (uuid:string) => {
        Object.keys(this.activeWorkers).map(worker=>{
            this.activeWorkers[worker].socket.emit(`DELETE_${uuid}`);//tell the worker to stop!
            this.activeWorkers[worker].activeJobs = this.activeWorkers[worker].activeJobs.filter((job)=>{
                return job.uuid != uuid
            })//removes the job from active jobs!
        });
        this.activeJobs[uuid].event.removeAllListeners()
        delete this.activeJobs[uuid]
    }

}