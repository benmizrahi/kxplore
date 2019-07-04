import { IEnvironment } from "../../../kxplore-shared-models/envierment";
import { TargetType } from "../../../kxplore-shared-models/enums";
import { KafkaConsumerHandler } from "./kafka-consumer.handler";
import { IJobInformation } from "../../../kxplore-shared-models/job-details";
import { MessagePerParition } from "../../consumer-strategy/strategies/messages-agg-per-partition";
import { PushFilterWorker } from "../../consumer-strategy/strategies/push-filter-workers";

export interface IConsumer {
    start(jobInfo:IJobInformation):Promise<any>
    stop(jobInfo:IJobInformation):Promise<any>
}

export interface IConsumerMessage {
    recivedTimestamp:Date
    data:any;
    dataname?:string
    groupbykey:number;
    groupbyname?:string;
}

export const strategyFactory = (type) => {
    return new PushFilterWorker(5,"select * from ? where counter > 1")
}

export function matchPatten(env:IEnvironment,strategy:string):IConsumer{
    switch(env.type){
         case TargetType.Kafka:
         return new KafkaConsumerHandler(strategyFactory(strategy));
         default:
         return new KafkaConsumerHandler(strategyFactory(strategy));
     }
 }