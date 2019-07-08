import { IEnvironment, IIEnvironmentInfo } from "../../../kxplore-shared-models/envierment";
import { KafkaDescibable } from "./kafka-describer";
import { TargetType } from "../../../kxplore-shared-models/enums";
import { IJobInformation } from "../../../kxplore-shared-models/job-details";

export interface IDescribale {
    describe(env:IEnvironment):Promise<IIEnvironmentInfo>;
    preJobOperation(payload:IJobInformation):Promise<boolean>;
}
export function matchPatten(env:IEnvironment):IDescribale{
   switch(env.type){
        case TargetType.Kafka:
        return new KafkaDescibable();
        default:
        return new KafkaDescibable();
    }
}