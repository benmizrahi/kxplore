export abstract class IEditeable {
    abstract validate():{status:boolean,error?:string}
    abstract getEmptyInstance():IEditeable;
}