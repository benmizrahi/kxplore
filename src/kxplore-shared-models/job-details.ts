import { IEnvironment } from "./envierment";

export interface IJobInformation {
    uuid:string;
    payload:any;
    env:IEnvironment;
}