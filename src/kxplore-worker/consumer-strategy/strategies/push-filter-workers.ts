import { AbstractStrategy } from "../abstract-strategy";
import { EventEmitter } from "events";
import { IConsumerMessage } from "../../handlers/consumers/IConsumer";
import * as alasql from 'alasql'

export class PushFilterWorker extends AbstractStrategy{
   
    private dataBulk = []
    private interval: NodeJS.Timer;
    private metadata : {statements:Array<{columns:any}>}
    
    outputEmitter: EventEmitter = new EventEmitter();

    constructor(pushIntervalSec:number=5,pushFilter){
        super(pushIntervalSec, pushFilter)
        this.metadata =  alasql.parse(pushFilter) as any;
    }

    maniplute(message: IConsumerMessage): void {
        try {
            this.dataBulk.push(JSON.parse(message.data))
        }
        catch(ex){ }
        if(!this.interval){
            this.interval = setInterval(()=>{
                var res = alasql(this.payload,[this.dataBulk]);
                this.outputEmitter.emit('INTERVAL_DATA_EXPORT',{ payload: res, metaColumns: this.metadata.statements[0].columns });
                this.dataBulk = []
            },this.pushIntervalSec * 1000)
        }   
    }
}