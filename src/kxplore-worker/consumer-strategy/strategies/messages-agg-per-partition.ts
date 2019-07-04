import { AbstractStrategy } from "../abstract-strategy";
import { EventEmitter } from "events";
import { IConsumerMessage } from "../../handlers/consumers/IConsumer";

export class MessagePerParition extends AbstractStrategy{
    
    private readonly counts:Array<{key:number,value:number}> = []

    outputEmitter: EventEmitter = new EventEmitter();
    private interval: NodeJS.Timer;

    constructor(pushIntervalSec:number=5){
        super(pushIntervalSec,null)
    }

    maniplute(message: IConsumerMessage): void {
        let isAdded = false;
        this.counts.map((data:{key:number,value:number})=>{
            if(data.key == message.groupbykey){
                data.value++
                isAdded = true
            }
            return data
        })
        if(!isAdded) this.counts.push({key:message.groupbykey,value:1})

        if(!this.interval){
            this.interval = setInterval(()=>{
                this.outputEmitter.emit('INTERVAL_DATA_EXPORT',{ payload: this.counts });
            },this.pushIntervalSec * 1000)
        }
    }


}
