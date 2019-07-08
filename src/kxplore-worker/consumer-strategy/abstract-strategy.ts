import { EventEmitter } from "events";
import { MessagePerParition } from "./strategies/messages-agg-per-partition";
import { IConsumerMessage, IStrategyResults } from "../handlers/consumers/IConsumer";

export abstract class AbstractStrategy {
  
    constructor(protected readonly pushIntervalSec:number=5,protected readonly payload:any){}

    abstract outputEmitter:EventEmitter;

    abstract maniplute(batchData:IConsumerMessage):Promise<IStrategyResults>

}