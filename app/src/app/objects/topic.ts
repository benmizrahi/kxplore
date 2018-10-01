import { IEditeable } from "./IEditable";

export class Topic implements IEditeable  {
   
    id:number
    envId:number
    envName:string
    topicName:string

    public validate():{status:boolean,error?:string} {

        if(!this.topicName) return {status:false,error:'topic name must be defined'}

        if(!this.envId ) return {status:false,error:'please select envierment'}

        return {status:true}
    }

    assign = (object:any) => {
       return Object.assign(new Topic,object);
    }

    getEmptyInstance = () => {
        let empty = new Topic();
        empty.envId = -1
        empty.topicName = ''
        return empty;
    }

}