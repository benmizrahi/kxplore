import { Injectable } from "@decorators/di";
import * as socket from 'socket.io'
import { IJobInformation } from "../../kxplore-shared-models/job-details";
import {EventEmitter } from 'events';

@Injectable()
export class KxploreWorkersHandler{

    private readonly activeJobs:{ [uuid: string] :  {event:EventEmitter, job:IJobInformation, activeWorkers:Array<string> } } = {}
    private readonly activeWorkers:{ [uuid: string] : socket.Socket } = {}


    connect = (uuid:string,socket:socket.Socket) => {
        console.log(`Worker registered : ${uuid} `)
        this.activeWorkers[uuid] = socket;
        Object.keys(this.activeJobs).map(job_id=>{  
            this.publish_job_to_worker(this.activeJobs[job_id].job,socket,this.activeJobs[job_id].event)
            this.activeJobs[job_id].activeWorkers.push(uuid);
        });

    }

    subscribe = (uuid:string):EventEmitter => {
         if(this.activeJobs[uuid])
             return this.activeJobs[uuid].event;
         else{
             return null;
         }
    }

    disconnect = (uuid:string) =>{
        //delete worker form list
        delete this.activeWorkers[uuid];
        //delete worker from all active jobs
        Object.keys(this.activeJobs).map(job_id=>{
            let index = this.activeJobs[job_id].activeWorkers.indexOf(uuid);
            if(index > -1)
                this.activeJobs[job_id].activeWorkers = this.activeJobs[job_id].activeWorkers.splice(index,1)
        });
        console.log(`Worker disconnected : ${uuid} `)
    }

    publishJob = (jobInfo:IJobInformation)=>{
         this.activeJobs[jobInfo.job_uuid] =  {event:new EventEmitter(),job:jobInfo,activeWorkers:[]};
         Object.keys(this.activeWorkers).map(worker=>{
            this.publish_job_to_worker(jobInfo,this.activeWorkers[worker],this.activeJobs[jobInfo.job_uuid].event)
            this.activeJobs[jobInfo.job_uuid].activeWorkers.push(worker);
        })
    }

    stopJob = (uuid:string) => {
        Object.keys(this.activeWorkers).map(worker=>{
             this.activeWorkers[worker].emit(`DELETE_${uuid}`);//tell the worker to stop!
        });
        if(this.activeJobs[uuid]){
            this.activeJobs[uuid].event.removeAllListeners()
            delete this.activeJobs[uuid]
        }
    }
    

    private publish_job_to_worker = (jobInfo:IJobInformation,worker_socket:socket.Socket ,job_emmiter:EventEmitter) => {
        worker_socket.emit('NEW_JOB',jobInfo);
        worker_socket.on(`JOB_DATA_${jobInfo.job_uuid}`,( data:{messages:Array<any>,uuid:string})=>{
            //on data from worker!
            if(this.activeJobs[jobInfo.job_uuid]){
                job_emmiter.emit(`MESSAGES_${jobInfo.job_uuid}`,data)
            }
        })  
    }
}