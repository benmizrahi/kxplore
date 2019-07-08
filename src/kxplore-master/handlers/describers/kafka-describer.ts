import { IDescribale } from "./IDescibable";
import { IEnvironment, IIEnvironmentInfo } from "../../../kxplore-shared-models/envierment";
import * as kafka from 'kafka-node'
import { IJobInformation } from "../../../kxplore-shared-models/job-details";

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

    preJobOperation(payload:IJobInformation):Promise<boolean> {
        return new Promise<boolean>((resolve,reject)=>{
            const client = new kafka.Client(payload.env.props['zookeeperUrl']);
            const offset = new kafka.Offset(client)
            offset.fetchLatestOffsets([payload.connectionObject.topic], (err, offsets) => {
                if (err) {
                    console.log(`error fetching latest offsets ${err}`)
                    return
                }
                var latest = 1
                Object.keys(offsets[payload.connectionObject.topic]).forEach( o => {
                    latest = offsets[payload.connectionObject.topic][o] > latest ? offsets[payload.connectionObject.topic][o] : latest
                })
                resolve(true);
            })
        });
    }
    
}