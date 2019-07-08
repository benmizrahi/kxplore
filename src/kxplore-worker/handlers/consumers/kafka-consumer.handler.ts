import { IJobInformation } from "../../../kxplore-shared-models/job-details";
var kafka = require('kafka-node');
import { EventEmitter } from "events";
import { AbstractConsumer } from "../abstract-consumer.handler";
var Queue = require('better-queue');
import * as alasql from 'alasql'

export interface KafkaMessage {
    partition:number
    timestamp:Date
    topic:string
    value:string
    key:any
    offset:number
    highWaterOffset:number
}

export class KafkaConsumerHandler extends AbstractConsumer {

    init(jobInfo: IJobInformation,jobObject:{emiter:EventEmitter,privateComp:any}) {
      
        const commitManager = new CommitManager();

        const onRebalance = async (err, assignments) => {
            if (err.code === kafka.CODES.ERRORS.ERR__ASSIGN_PARTITIONS) {
                consumerGroup.assign(assignments);
            } else if (err.code === kafka.CODES.ERRORS.ERR__REVOKE_PARTITIONS) {
              if (paused) {
                consumerGroup.resume(assignments);
                paused = false;
              }
              q.remove((d, p) => { return true; });
              consumerGroup.unassign();
              commitManager.onRebalance();
            } else {
              console.error(`Rebalace error : ${err}`);
            }
         }

        let paused = false;
        const maxQueueSize = jobInfo.env.props['queue-size-per-worker'] || 100;
        const options = {
            // connect directly to kafka broker (instantiates a KafkaClient)
            kafkaHost: jobInfo.env.props['kafkaHost'], //'127.0.0.1:9092,127.0.0.1:9093,127.0.0.1:9094',
            host: jobInfo.env.props['zookeeper'], //'127.0.0.1:2181',
            groupId: `kxplore_consumer___${jobInfo.connectionObject.uId}`,
            sessionTimeout: jobInfo.env.props['sessionTimeout'],  //15000,
            fetchMaxBytes: 1024 * 1024,
            fetchMaxWaitMs: 5000,
            fetchMinBytes: 1,
            // An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
            // built ins (see below to pass in custom assignment protocol)
            protocol: ['roundrobin'],
            // Offsets to use for new groups other options could be 'earliest' or 'none'
            // (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
            fromOffset: jobInfo.connectionObject.isOldest ? "earliest" : "latest", //'latest',
            // how to recover from OutOfRangeOffset error (where save offset is past server retention)
            // accepts same value as fromOffset
            outOfRangeOffset: 'latest',
            'rebalance_cb': onRebalance.bind(this),
            'enable.auto.commit': false
        };
        
        
        const consumerGroup = new kafka.ConsumerGroup(options, jobInfo.connectionObject['topic']);

        consumerGroup.on('ready', () => {
            commitManager.start(consumerGroup);
        });

        var q = new Queue(async (batch:Array<KafkaMessage>, done) => {
          try {
                  let time = new Date()
                  const data = batch.map(message=>JSON.parse(message.value));
                  let results =  await this.strategy.maniplute({recivedTimestamp:time,data:data})
                  results.outputEmiter.emit('INTERVAL_DATA_EXPORT',{ payload: results.messages, metaColumns: results.metaColumns });  
                  batch.map(data=>commitManager.notifyStartProcessing(data));
                  done()
            }
            catch(e) {
               done()
            }
            finally {
              batch.map(data=>commitManager.notifyStartProcessing(data));
            }

        }, { batchSize: maxQueueSize })

        consumerGroup.on('message', (messageWrapper) => {
            q.push(messageWrapper);
        });

        q.on('drain', function (){
          consumerGroup.resume();
        })

    
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
        
        
        jobObject.privateComp = consumerGroup;

        this.strategy.outputEmitter.on('INTERVAL_DATA_EXPORT',(payload)=>{
            jobObject.emiter.emit(`JOB_DATA_${jobInfo.job_uuid}`,payload)  
        })

        console.info(`Listening for the topic: ${jobInfo.connectionObject['topic']} messages,worker id: ${process.env.WORKER_ID}`);;
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


class CommitManager {

    private COMMIT_TIME_INTERVAL = 5000;
    private partitionsData = {}
    private lastCommited = [];
    private consumer = null;

    start(consumer) {
      this.consumer = consumer;
      setInterval(() => {
          this.commitProcessedOffsets();
      }, this.COMMIT_TIME_INTERVAL)
    }

    notifyStartProcessing(data) {
      const partition = data.partition;
      const offset = data.offset;
      const topic = data.topic;
      this.partitionsData[partition] = this.partitionsData[partition] || [];
      this.partitionsData[partition].push({
          offset: offset,
          topic: topic,
          done: false
      });
    }

    notifyFinishedProcessing(data) {
      const partition = data.partition;
      const offset = data.offset;
      this.partitionsData[partition] = this.partitionsData[partition] || [];
      let record = this.partitionsData[partition].filter(
        (record) => { return record.offset === offset }
      )[0];
      if (record) {
          record.done = true;
      }
    }

     commitProcessedOffsets = async () => {
      try {
        let offsetsToCommit = [];
        for (let key in this.partitionsData) {
          let pi = this.partitionsData[key]
            .findIndex((record) => { return record.done }); // last processed index
          let npi = this.partitionsData[key]
            .findIndex((record) => { return !record.done }); // first unprocessed index
          let lastProcessedRecord = npi > 0 ?
            this.partitionsData[key][npi - 1] : 
            (pi > -1 ? 
              this.partitionsData[key][this.partitionsData[key].length - 1] : 
              null
            );
          if (lastProcessedRecord) {
            offsetsToCommit.push({ 
              partition: (key as any) - 0, 
              offset: lastProcessedRecord.offset,
              topic: lastProcessedRecord.topic 
            });
            // remove commited records from array
            this.partitionsData[key]
              .splice(0, this.partitionsData[key].indexOf(lastProcessedRecord) + 1); 
          }
        }
        
        if (offsetsToCommit.length > 0) {
          this.consumer.commit(offsetsToCommit);
        }

        this.lastCommited = offsetsToCommit.length > 0 ? 
          offsetsToCommit : 
          this.lastCommited;
        Promise.resolve();
    }
      catch (e) {
        Promise.reject(e)
      }
    }

    onRebalance =() => {
      this.partitionsData = {};
    }

    getLastCommited =() => {
      return this.lastCommited;
    }

    resetOffsets = (client,topic,consumer) => {
      var offset = new kafka.Offset(client)
      offset.fetchLatestOffsets([topic], (err, offsets) => {
          if (err) {
              console.log(`error fetching latest offsets ${err}`)
              return
          }
          var latest = 1
          Object.keys(offsets[topic]).forEach( o => {
              latest = offsets[topic][o] > latest ? offsets[topic][o] : latest
          })
          consumer.setOffset(topic, 0, latest-1)
      })
    }
}