import { IEditeable } from "./IEditable";

export interface IObjectService {
    get():Promise<Array<IEditeable>>
    save(obj:IEditeable):Promise<Array<IEditeable>>
    delete(obj:IEditeable):Promise<Array<IEditeable>>
}