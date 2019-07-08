import { AbstractStrategy } from "../abstract-strategy";
import { EventEmitter } from "events";
import { IConsumerMessage, IStrategyResults } from "../../handlers/consumers/IConsumer";

export class MessagePerParition extends AbstractStrategy{
    
    private readonly counts:Array<{key:number,value:number}> = []

    outputEmitter: EventEmitter = new EventEmitter();
    private metadata : {statements:Array<{columns:any}>} = {statements:[]}

    constructor(pushIntervalSec:number=5){
        super(pushIntervalSec,null)
    }

    maniplute(message: IConsumerMessage):Promise<IStrategyResults>  {
        return new Promise<IStrategyResults>((resolve,reject)=>{
            // try{
            //     let isAdded = false;
            //     this.counts.map((data:{key:number,value:number})=>{
            //         if(data.key == message){
            //             data.value++
            //             isAdded = true
            //         }
            //         return data
            //     });
            //     if(!isAdded) this.counts.push({key:message.groupbykey,value:1})
            //     resolve({messages:this.counts,outputEmiter:this.outputEmitter,metaColumns:this.metadata.statements[0].columns})
            // } 
            // catch(ex){
            //     reject(ex);
            // }\
            reject()
        });
    }
}
