import { IEnvironment } from "../../../kxplore-shared-models/envierment";
import { TargetType } from "../../../kxplore-shared-models/enums";
import { KafkaConsumerHandler } from "./kafka-consumer.handler";
import { IJobInformation } from "../../../kxplore-shared-models/job-details";

export interface IConsumer {
    start(jobInfo:IJobInformation):Promise<any>
    stop(jobInfo:IJobInformation):Promise<any>
}

export function matchPatten(env:IEnvironment):IConsumer{
    switch(env.type){
         case TargetType.Kafka:
         return new KafkaConsumerHandler();
         default:
         return new KafkaConsumerHandler();
     }
 }