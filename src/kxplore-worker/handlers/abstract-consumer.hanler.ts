import { EventEmitter } from "events";
import { IConsumer } from "./consumers/IConsumer";
import { IJobInformation } from "../../kxplore-shared-models/job-details";

export abstract class AbstractConsumer implements IConsumer {

    private readonly activeJobs:{ [uuid: string] : {emiter:EventEmitter,privateComp:any } } = {}
    
    start(jobInfo:IJobInformation): Promise<EventEmitter> {
        return  new Promise<EventEmitter>((resolve,reject)=>{
            try {
                const job = {emiter: new EventEmitter(),privateComp:null}
                this.init(jobInfo,job)
                this.activeJobs[jobInfo.uuid] = job;
                resolve(job.emiter)
            }
            catch(ex){
                reject(ex);
            }
        })
    }
    
    stop(jobInfo:IJobInformation): Promise<boolean> {
        return  new Promise<boolean>((resolve,reject)=>{
            try {
                this.dispose(this.activeJobs[jobInfo.uuid]);
                delete this.activeJobs[jobInfo.uuid]
                resolve(true);
            }     
            catch(ex){
                reject(ex);
            }
        });
    }

    protected abstract init(jobInfo:IJobInformation,jobObject:{emiter:EventEmitter,privateComp:any })

    protected abstract dispose(jobObject:{emiter:EventEmitter,privateComp:any })

}