import { IEnvironment } from "./envierment";

export class TaskInfo {
    partition:number;
    from:number;
    to:number;
    query:string;
    source:string;
    processing:boolean = false;
    processed:boolean = false;
    taskId:string;
    worker:string;
    env:IEnvironment;
    results?:TaskResults;
    listener?:any;
    job_id?:string;
    batch_id?:number;
}


export class TaskResults {
    columns:Array<string>
    data:Array<Array<any>>
}