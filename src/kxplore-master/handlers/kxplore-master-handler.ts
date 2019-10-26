import { IActionResult } from '../../kxplore-shared-models/envierment'
import { IJobInformation } from '../../kxplore-shared-models/job-details';
import { Injectable, Inject } from '@decorators/di';
import {KxploreStreamingHandler} from './kxplore-streaming-handler'
import { TaskInfo } from '../../kxplore-shared-models/task-info';
import { Observable } from 'rxjs';

@Injectable()
export class KxploreMasterHandler {
    
    private readonly jobs: {[uuid: string] : {  job:IJobInformation,observable:Observable<TaskInfo> }  } = {}

    constructor(@Inject(KxploreStreamingHandler) private readonly streaming:KxploreStreamingHandler){}

    start = async (payload:IJobInformation):Promise<IActionResult> => {
        try{
            const j_observer = Observable.create(async(observer:any) => {
                await this.streaming.start(payload,observer)
            });
            this.jobs[payload.job_uuid] =  { job:payload,observable:j_observer }
            this.streaming.subscriber(j_observer)
            return {status:true}
        }
        catch(ex){
            throw `unable to  publish new job! ${payload}, error: ${ex}`
        }
    }

    stop = (job_uuid:string):Promise<IActionResult> => {
        return new Promise<IActionResult>((resolve,reject)=>{
            try{
                this.streaming.stop(job_uuid)
                resolve({status:true})
            }
            catch(ex){
                reject(`unable to get stop job - ${job_uuid}, error: ${ex}`)
            }
        });   
    }

    subscribe = (job_uuid:string) => {
        
    }

}

