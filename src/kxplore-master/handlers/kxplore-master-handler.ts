import {IEnvironment,IIEnvironmentInfo, IActionResult } from '../../kxplore-shared-models/envierment'
import { IJobInformation } from '../../kxplore-shared-models/job-details';
import { Injectable, Inject } from '@decorators/di';
import { KxploreWorkersHandler } from './kxplore-workers-handler';
import { IDescribale } from './describers/IDescibable';

@Injectable()
export class KxploreMasterHandler {
    
    constructor(@Inject('global-config') private readonly config:any,
                @Inject(KxploreWorkersHandler) private readonly workersHandler:KxploreWorkersHandler){}

    describe = (env:IEnvironment,describer:IDescribale):Promise<IIEnvironmentInfo> => {
        return describer.describe(env);
    }

    start = (payload:IJobInformation):Promise<IActionResult> => {
        return new Promise<IActionResult>((resolve,reject)=>{
            try{
                this.workersHandler.publishJob(payload)
                resolve({status:true})
            }
            catch(ex){
                reject(`unable to get publish new job! ${payload}, error: ${ex}`)
            }
        });
    }

    stop = (payload:IJobInformation):Promise<IActionResult> => {
        return new Promise<IActionResult>((resolve,reject)=>{
            try{
                this.workersHandler.stopJob(payload)
                resolve({status:true})
            }
            catch(ex){
                reject(`unable to get publish new job! ${payload}, error: ${ex}`)
            }
        });   
    }
}

