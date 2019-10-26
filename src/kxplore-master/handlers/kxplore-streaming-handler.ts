import { Injectable, Inject } from "@decorators/di";
import { IJobInformation } from '../../kxplore-shared-models/job-details';
import { Observable } from "rxjs";
import { KafkaQueue } from "./supported-queues/kafka-queue";
import { KxploreWorkersHandler } from "./kxplore-workers-handler";
import { TaskInfo } from "../../kxplore-shared-models/task-info";

@Injectable()
export class KxploreStreamingHandler{

    private readonly jobs: {[uuid: string] : { timer: NodeJS.Timer,batchs:{ [id:string] : { count:number,results:number, tasks:{ [id:string]: TaskInfo }  }   } } } = {};

    constructor(@Inject('global-config') private readonly config:any,
    @Inject(KafkaQueue) private readonly queue:KafkaQueue,
    @Inject(KxploreWorkersHandler) private readonly workersHandler:KxploreWorkersHandler) {}

    start = async (payload:IJobInformation,listener:Observable<any>) => {
        const interval =  +this.config['interval']
        let interval_timer = setInterval(async ()=>{
            let batchId = Object.keys(this.jobs[payload.job_uuid].batchs).length++
            let tasksPlan = await this.queue.buildPlan(payload)
            tasksPlan = tasksPlan.map(t=> { t.job_id=payload.job_uuid;t.batch_id = batchId; return t}).map((t)=>this.workersHandler.transfer(t,listener))
            this.jobs[payload.job_uuid].batchs[batchId] = { count:tasksPlan.length,results:0, tasks: {} }
            tasksPlan.forEach((t)=>{
                this.jobs[payload.job_uuid].batchs[batchId].tasks[t.taskId] = t;
            })
        },interval)
        this.jobs[payload.job_uuid] = {timer:interval_timer,batchs:{}};
    }

    subscriber = (listener) =>{
        listener.subscribe((task:TaskInfo)=>{
            this.jobs[task.job_id].batchs[task.batch_id].tasks[task.taskId] = task
            this.jobs[task.job_id].batchs[task.batch_id].results++
            if(this.jobs[task.job_id].batchs[task.batch_id].results == this.jobs[task.job_id].batchs[task.batch_id].count){
                
            }
       })
    }

    stop = (job_uuid:string) => {
        for (let batch in this.jobs[job_uuid].batchs)
            for (let task in this.jobs[job_uuid].batchs[batch].tasks)
                this.workersHandler.cancel(this.jobs[job_uuid].batchs[batch].tasks[task])
        
         clearInterval(this.jobs[job_uuid].timer)
         delete this.jobs[job_uuid];
    }


}