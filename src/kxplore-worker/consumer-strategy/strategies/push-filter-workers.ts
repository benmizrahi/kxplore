import { AbstractStrategy } from "../abstract-strategy";
import { EventEmitter } from "events";
import { IConsumerMessage, IStrategyResults } from "../../handlers/consumers/IConsumer";
import * as alasql from 'alasql'

export class PushFilterWorker extends AbstractStrategy{
   
    private metadata : {statements:Array<{columns:any}>}
    
    outputEmitter: EventEmitter = new EventEmitter();

    constructor(pushIntervalSec:number=5,pushFilter){
        super(pushIntervalSec, pushFilter)
        this.metadata = alasql.parse(pushFilter) as any;
    }

    maniplute(batchData: IConsumerMessage):Promise<IStrategyResults> {
        let _this = this;
        return new Promise<IStrategyResults>((resolve,reject)=>{
            var res = alasql(this.payload,[batchData.data]);
            
            try {
                resolve({messages:res,outputEmiter:_this.outputEmitter,metaColumns:_this.metadata.statements})
            }
            catch(ex){
                reject(ex)
            }
        })
    }
}