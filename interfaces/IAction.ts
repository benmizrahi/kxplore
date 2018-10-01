export interface IAction{
    apply(data:any):void
    update?(data:any):void
}