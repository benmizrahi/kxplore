import { TargetType } from "../../../kxplore-shared-models/enums";
import { KafkaConsumerHandler } from "./kafka-consumer.handler";
import { IJobInformation } from "../../../kxplore-shared-models/job-details";
import { PushFilterWorker } from "../../consumer-strategy/strategies/push-filter-workers";
import { EventEmitter } from "events";
import { PubSubConsumerHandler } from "./pubsub-consumer.handler";

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
    switch(jobData.connectionObject.type){
         case TargetType.Kafka:
         return new KafkaConsumerHandler(strategyFactory(jobData));
         case TargetType.PubSub:
         return new PubSubConsumerHandler(strategyFactory(jobData));
         default:
         return new KafkaConsumerHandler(strategyFactory(jobData));
     }
 }