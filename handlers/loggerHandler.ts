import { IHandler, IHandlerAction, IHandlerResults } from "../interfaces/IHandler";
import { LoggerAction } from "../interfaces/enums";
import { Injectable, Inject } from "@decorators/di";
import * as moment from 'moment';


@Injectable()
export class ILoggerHandler implements IHandler<LoggerAction> {
    
    private readonly original = {
        debug:console.debug,
        error:console.error,
        info:console.info
    }

    constructor(@Inject('global-config') private readonly config:{loggers:Array<string>}){
        console.debug = (message) => {
            this.handle({action:LoggerAction.debug,payload:message});
        }
        console.error = (message) => {
            this.handle({action:LoggerAction.error,payload:message});
        }
        console.info = console.log = (message) => {
            this.handle({action:LoggerAction.info,payload:message});
        }
    }

    handle(handleParams: IHandlerAction<LoggerAction>): IHandlerResults<LoggerAction> {
        let datetime = moment();
        switch(handleParams.action){
            case LoggerAction.error:
                this.original.error(`${datetime} ERROR: ${handleParams.payload}`);
                break;
            case LoggerAction.info:
                this.original.info(`${datetime} INFO: ${handleParams.payload}`);
                break;
            case LoggerAction.debug:
                this.original.error(`${datetime} DEBUG: ${handleParams.payload}`);
                break;
        }
        return  {action:handleParams.action,results:"OK",status:true};
    }
}