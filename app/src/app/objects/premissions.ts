import { IEditeable } from "./IEditable";

export class Premissions implements IEditeable  {

    email?:string
    topicName?:string
    envName?:string
   
    id:number
    uId:number
    tId:number
    eId:number
    
    validate(): { status: boolean; error?: string; } {

       if(!this.uId || this.uId  == -1) return {status:false,error:'user is mendetory field'}

       if(!this.eId || this.eId  == -1) return {status:false,error:'envierment is mendetory field'}

       if(!this.tId || this.tId  == -1) return {status:false,error:'topic is mendetory field'}

       return {status:true};
    }
    getEmptyInstance = () => {
        let empty = new Premissions();
        empty.eId = -1;
        empty.tId = -1;
        empty.uId = -1;
        return empty;
    }
}