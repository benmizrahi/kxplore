import { IDescribale } from "./IDescibable";
import { IEnvironment, IIEnvironmentInfo } from "../../../kxplore-shared-models/envierment";
import * as kafka from 'kafka-node'

export class KafkaDescibable implements IDescribale {

    describe(env:IEnvironment):Promise<IIEnvironmentInfo> {
        return new Promise<IIEnvironmentInfo>((resolve,reject)=>{
            const client = new kafka.Client(env.props['zookeeperUrl']);
            client.once('connect', function () {
                client.loadMetadataForTopics([], function (error, results) {
                  if (error) {
                      reject(`unable to get env information ${env}, error: ${error}`)
                      return
                  }else{
                     resolve({data:results});
                  }
                });
            });
        })
    }
    
}