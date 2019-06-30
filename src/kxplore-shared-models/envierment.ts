import { TargetType } from "./enums";

export interface IEnvironment {
    type:TargetType
    props:{ [key: string] : string; }
}

export interface IIEnvironmentInfo {}

export interface IActionResult {
    status:boolean
}