import { IEditeable } from "./IEditable";

export class User implements IEditeable {
    
    email:string;
    isAdmin:boolean;
    id:number;

    validate(): { status: boolean; error?: string; } {
        if(!this.email)  return {status:false,error:'email must be defined'}
        return {status:true}
    }

    getEmptyInstance = () => {
        let empty = new User();
        empty.email = ''
        empty.isAdmin = false
        return empty;
    }

}