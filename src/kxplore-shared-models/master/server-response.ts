

//base response
export interface ServerResponse {
    status:boolean
    message:string 
}

//describe env props
export interface IDescribeResponse extends ServerResponse{
    results:any
}

//start job 
export interface IStartJobResponse extends ServerResponse{
    uuid:string
}
