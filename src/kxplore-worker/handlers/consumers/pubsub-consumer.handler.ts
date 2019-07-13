import { AbstractConsumer } from "../abstract-consumer.handler";
import { EventEmitter } from "events";
import { IJobInformation } from "../../../kxplore-shared-models/job-details";
import { PubSub} from '@google-cloud/pubsub';

export class PubSubConsumerHandler extends AbstractConsumer {
   
    init = async (jobInfo:IJobInformation,jobObject:{emiter:EventEmitter,privateComp:any })  => {
        const pubsub = new PubSub({projectId:'company-dev'});
        const subscription = pubsub.subscription(`kxplore_consumer___${jobInfo.connectionObject.uId}`);
        await pubsub.topic(jobInfo.connectionObject['topic'],{batching:{maxMessages:100,maxMilliseconds:5000}}).subscription(`kxplore_consumer___${jobInfo.connectionObject.uId}`);
        subscription.on(`message`,async (message)=>{
            try {
                //console.log(message)
                let results = await this.strategy.maniplute({data:[JSON.parse(message.data.toString('utf8'))],recivedTimestamp:new Date()})
                jobObject.emiter.emit(`JOB_DATA_${jobInfo.job_uuid}`,{ payload: results.messages, metaColumns: results.metaColumns }) 
                message.ack();
            }
            catch(err){
                console.error(err);
            }
        });
        subscription.on(`error`, (err)=>{
            console.error(`pubsub error ${JSON.stringify(err)}`)
        });

        jobObject.privateComp = subscription;

    }

    protected dispose = async (jobObject: { emiter: EventEmitter; privateComp: any; }) :Promise<boolean> => {
        try {
            let res =  await jobObject.privateComp.close();
            console.info(`closing subscription pubsub ${JSON.stringify(res)}`);
            return true;
        }
        catch(ex){
            console.log(`error while closing pubsub consumer ${JSON.stringify(ex)}`);
            return false;
        }
    }
}