import { Injectable, Inject } from "@decorators/di";
import * as socket from 'socket.io'
import { TaskInfo } from "../../kxplore-shared-models/task-info";
import { Observable } from "rxjs";

@Injectable()
export class KxploreWorkersHandler{
    
    private readonly activeWorkers:{ [uuid: string] : {socket:socket.Socket,count:number } } = {}
    private readonly subscribers: {[j_uuid: string] : any}

    constructor(@Inject('global-config') private readonly config:any){}

    connect = (uuid:string,socket:socket.Socket) => {
        console.log(`Worker registered : ${uuid} `)
        this.activeWorkers[uuid] = { socket:socket,count:0 }
        
        socket.on('TASK_CANCELED',(t:TaskInfo)=>{
            this.activeWorkers[uuid].count--
            this.subscribers[t.job_id].next(t)
        });

        socket.on('TASK_FINISHED',(t:TaskInfo)=>{
            this.activeWorkers[uuid].count--
            this.subscribers[t.job_id].next(t)
        })

    }

    disconnect = (uuid:string) =>{
        //delete worker form list
        delete this.activeWorkers[uuid];
        //delete worker from all active jobs
        console.log(`Worker disconnected : ${uuid} `)
    }

    transfer = (t:TaskInfo,observer:Observable<any>):TaskInfo=>{
       const max = parseInt(this.config['max-tasks-per-worker']);
       let w =  this.selectNextWorker(max)
       if(w){
            t.processing = true;
            t.worker = w;
            this.activeWorkers[w].socket.emit('PROCESS_TASK',t);
            this.activeWorkers[w].count++
            console.log(`processing task on worker ${w}! `)
            return t
       }else{
           setTimeout(()=>this.transfer(t,observer),parseInt(this.config['worker-check-frquency-sec']) * 1000)
       }
    }

    cancel = (t:TaskInfo) => {
        if(t.worker){
            this.activeWorkers[t.worker].socket.emit('CANCEL_TASK',t); 
        }
    }

    selectNextWorker = (max) => {
     let selectedWorker,tasksCount = null;
       for (let worker in this.activeWorkers){
           if(this.activeWorkers[worker].count == max){
               continue;
           }
           if(tasksCount == null || this.activeWorkers[worker].count < tasksCount ){
             selectedWorker = worker
             tasksCount = this.activeWorkers[worker].count;
           }
       }

       return selectedWorker;
    }

}