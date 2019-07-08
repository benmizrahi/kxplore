import { IEnvironment } from "./envierment";
import {ConnectionObject} from './connection-object'

export interface IJobInformation {
    connectionObject:ConnectionObject
    env:IEnvironment;
    job_uuid:string;
}