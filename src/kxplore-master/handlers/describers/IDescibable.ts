import { IEnvironment, IIEnvironmentInfo } from "../../../kxplore-shared-models/envierment";
import { KafkaDescibable } from "./kafka-describer";
import { TargetType } from "../../../kxplore-shared-models/enums";

export interface IDescribale {
    describe(env:IEnvironment):Promise<IIEnvironmentInfo>;
}
export function matchPatten(env:IEnvironment):IDescribale{
   switch(env.type){
        case TargetType.Kafka:
        return new KafkaDescibable();
        default:
        return new KafkaDescibable();
    }
}