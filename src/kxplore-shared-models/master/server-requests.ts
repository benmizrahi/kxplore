import {IEnvironment} from '../envierment'

interface IJobOperations{
    jobId:number
    env:IEnvironment
}

export interface IStartJob  {
    env:IEnvironment
    params:{ [key: string] : string; }
}


export interface IDescribeRequest {
    env:IEnvironment
}

//subscribe to active job
export interface ISubscribeRequest extends IJobOperations {
}


//apply filter on active job id
interface IApplyFilterRequest extends IJobOperations {
    filter:string
}

//Stops the active job is status running
interface IStopJobRequest extends IJobOperations {}

//Deletes active/stoped job 
interface IDeleteJobRequest extends IJobOperations {}

//Resume stoped job
interface IResumeJobRequest extends IJobOperations {}

