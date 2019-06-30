import { IEditeable } from "./IEditable";

export class Envierment  implements IEditeable  {
     
     id?:number
     envName:string
     props:Object
     public validate():{status:boolean,error?:string} {

         if(!this.envName) return {status:false,error:'envierment name must be defined'}

         if(!this.props || Object.keys(this.props).length == 0) return {status:false,error:'properties must have at last one config value'}

         return {status:true}
     }
     assign = (object:any) => {
        return Object.assign(new Envierment,object);
     }

     getEmptyInstance = () => {
        let empty = new Envierment();
        empty.envName = ''
        empty.props = {}
        return empty;
    }

}