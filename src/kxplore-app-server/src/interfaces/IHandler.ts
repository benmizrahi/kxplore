export interface IHandler<T> {
    handle(handleParams:IHandlerAction<T>): Promise<IHandlerResults<T>> | IHandlerResults<T> ;
}

export interface IBindableHanlder<T> extends IHandler<T> {
    bindHandle():Promise<IHandlerResults<T>>
    unBindHandler():Promise<boolean>;
}

export interface IHandlerResults<T> {
    status:boolean;
    action:T,
    results?:any
}

export interface IHandlerAction<T> {
    action:T,
    payload:any
}