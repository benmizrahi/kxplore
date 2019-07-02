import { IJobInformation } from "../../../kxplore-shared-models/job-details";
var kafka = require('kafka-node');
import { EventEmitter } from "events";
import { AbstractConsumer } from "../abstract-consumer.hanler";
import { queue } from 'async';

export class KafkaConsumerHandler extends AbstractConsumer {


    init(jobInfo: IJobInformation,jobObject:{emiter:EventEmitter,privateComp:any}) {
     
        const options = {
            // connect directly to kafka broker (instantiates a KafkaClient)
            kafkaHost: jobInfo.env.props['kafkaHost'], //'127.0.0.1:9092,127.0.0.1:9093,127.0.0.1:9094',
            host: jobInfo.env.props['zookeeper'], //'127.0.0.1:2181',
            groupId: `kxplore_consumer___${jobInfo.userId}`,
            sessionTimeout: jobInfo.env.props['sessionTimeout'],  //15000,
            fetchMaxBytes: 1 * 1024 * 1024, // 10 MB
            // An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
            // built ins (see below to pass in custom assignment protocol)
            protocol: ['roundrobin'],
            // Offsets to use for new groups other options could be 'earliest' or 'none'
            // (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
            fromOffset: jobInfo.fromOffset, //'latest',
            // how to recover from OutOfRangeOffset error (where save offset is past server retention)
            // accepts same value as fromOffset
            outOfRangeOffset: 'latest'
          };
        
        const consumerGroup = new kafka.ConsumerGroup(options, jobInfo.payload['topic']);
     
        const q = queue((payload: any, cb: any)=> {
            setImmediate(() => {
                jobObject.emiter.emit(`JOB_DATA_${jobInfo.uuid}`,{payload:payload})
                cb()
            });
        }, jobInfo.env.props['threads']);

        consumerGroup.on('message', (messageWrapper) => {
            const message: any = messageWrapper.value;
            q.push(message);
            consumerGroup.pause();
        });
    
        consumerGroup.on('error',  (err) =>{
            const failedToRebalanceConsumerError = err.message && err.message.includes('FailedToRebalanceConsumerError');
            const leaderNotAvailable = err.message && err.message.includes('LeaderNotAvailable');
            if (failedToRebalanceConsumerError || leaderNotAvailable) {
                return setImmediate(() => consumerGroup.close(true, () => this.init(jobInfo,jobObject)));
            }
            console.error(`Kafka error happened: ${JSON.stringify(err)}`);
        });

        consumerGroup.on('offsetOutOfRange', function (topicObj: any) {
          
        });
        
        q.drain = () => {
            consumerGroup.resume();
        };
        jobObject.privateComp = consumerGroup;
        console.info(`Listening for the topic: ${jobInfo.payload['topic']} messages,worker id: ${process.env.WORKER_ID}`);;
    }

    dispose(jobObject:{emiter:EventEmitter,privateComp:any}){
        jobObject.privateComp.close(true,(err)=>{
            if(err) console.error(`error while stoping consumer ${JSON.stringify(err)}`)
            else{
                console.info(`consumer stoped on worker id: ${process.env.WORKER_ID}`)
            }
        })
    }

}
