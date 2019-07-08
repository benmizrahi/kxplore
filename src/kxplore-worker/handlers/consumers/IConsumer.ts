import { IEnvironment } from "../../../kxplore-shared-models/envierment";
import { TargetType } from "../../../kxplore-shared-models/enums";
import { KafkaConsumerHandler } from "./kafka-consumer.handler";
import { IJobInformation } from "../../../kxplore-shared-models/job-details";
import { MessagePerParition } from "../../consumer-strategy/strategies/messages-agg-per-partition";
import { PushFilterWorker } from "../../consumer-strategy/strategies/push-filter-workers";
import { EventEmitter } from "events";

export interface IConsumer {
    start(jobInfo:IJobInformation):Promise<any>
    stop(job_uuid:string):Promise<any>
}

export interface IConsumerMessage {
    recivedTimestamp:Date
    data:Array<Object>;
}

export interface IStrategyResults {
    messages:Array<any>
    outputEmiter:EventEmitter
    metaColumns:Array<{}>
}

export const strategyFactory = (jobData:IJobInformation) => {
    return new PushFilterWorker(5,jobData.connectionObject.query)
}

export function matchPatten(jobData:IJobInformation):IConsumer{
    switch(jobData.env.type){
         case TargetType.Kafka:
         return new KafkaConsumerHandler(strategyFactory(jobData));
         default:
         return new KafkaConsumerHandler(strategyFactory(jobData));
     }
 }