import { AbstractStrategy } from "../abstract-strategy";
import { EventEmitter } from "events";
import { IConsumerMessage } from "../../handlers/consumers/IConsumer";
import * as alasql from 'alasql'

export class PushFilterWorker extends AbstractStrategy{
   
    outputEmitter: EventEmitter = new EventEmitter();

    constructor(pushIntervalSec:number=5,pushFilter){
        super(pushIntervalSec, pushFilter)
    }

    maniplute(message: IConsumerMessage): void {
        var res = alasql(this.payload,[JSON.parse(message.data)]);
        //this.outputEmitter.emit('INTERVAL_DATA_EXPORT',{ payload: Number});
    }
}