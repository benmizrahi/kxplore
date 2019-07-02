import { IEnvironment } from "./envierment";

export interface IJobInformation {
    uuid:string;
    payload:any;
    userId:string;
    fromOffset:string;
    env:IEnvironment;
}