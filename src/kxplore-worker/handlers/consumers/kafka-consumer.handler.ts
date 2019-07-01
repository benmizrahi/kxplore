import { IJobInformation } from "../../../kxplore-shared-models/job-details";
var kafka = require('kafka-node');
import { EventEmitter } from "events";
import { AbstractConsumer } from "../abstract-consumer.hanler";

export class KafkaConsumerHandler extends AbstractConsumer {

    init(jobInfo: IJobInformation,jobObject:{emiter:EventEmitter,privateComp:any}) {
        var options = {
            // connect directly to kafka broker (instantiates a KafkaClient)
            kafkaHost: '127.0.0.1:9092',
            groupId: 'test',
            autoCommit: true,
            autoCommitIntervalMs: 5000,
            sessionTimeout: 15000,
            fetchMaxBytes: 10 * 1024 * 1024, // 10 MB
            // An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
            // built ins (see below to pass in custom assignment protocol)
            protocol: ['roundrobin'],
            // Offsets to use for new groups other options could be 'earliest' or 'none'
            // (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
            fromOffset: 'latest',
            // how to recover from OutOfRangeOffset error (where save offset is past server retention)
            // accepts same value as fromOffset
            outOfRangeOffset: 'latest'
          };
        
          var consumerGroup = new kafka.ConsumerGroup(options, jobInfo.payload['topic']);
        
          consumerGroup.on('message', function (message) {
            console.log('Message: ' + message);
            jobObject.emiter.emit('NEW_DATA',{payload:message})
          });
        
          consumerGroup.on('error', function onError(error) {
            console.error(error);
          });
        
        console.info(`Listening for the topic: ${jobInfo.payload['topic']} messages,worker id: ${process.env.WORKER_ID}`);;
    }

    dispose(jobObject:{emiter:EventEmitter,privateComp:any}){
        jobObject.privateComp.stop()
    }

}
