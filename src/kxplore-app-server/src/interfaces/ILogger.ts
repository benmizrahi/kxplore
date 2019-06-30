export interface ILogger {
    debug:(m:string)=>any;
    info:(m:string)=>any;
    error:(m:string)=>any;
}