import { IJobInformation } from "../../../kxplore-shared-models/job-details";
import { Kafka } from 'kafkajs'
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

   async init(jobInfo: IJobInformation,jobObject:{emiter:EventEmitter,privateComp:any}) {
 
     const kafka = new Kafka({
        clientId: 'kxplore-app',
        brokers: jobInfo.env.props['kafkaHost'].split(','),
        connectionTimeout: 3000,
        requestTimeout: 25000
      })
      const consumer = kafka.consumer({ groupId: `kxplore_consumer___${jobInfo.connectionObject.uId}__${jobInfo.connectionObject['topic']}`})

      await consumer.connect()
      await consumer.subscribe({ topic: jobInfo.connectionObject['topic'],fromBeginning: jobInfo.connectionObject.isOldest })

      await consumer.run({
        eachBatch: async ({ batch, resolveOffset, heartbeat, isRunning, isStale }) => {
          try {
                let results = await this.strategy.maniplute({data:batch.messages.map(message=>JSON.parse(message.value.toString('utf8'))),recivedTimestamp:new Date()})
                jobObject.emiter.emit(`JOB_DATA_${jobInfo.job_uuid}`,{ payload: results.messages, metaColumns: results.metaColumns }) 
                batch.messages.map(async message=> await resolveOffset(message.offset)) 
                await heartbeat()
              }
            catch(e){
                consumer.pause([{ topic:jobInfo.connectionObject['topic'] }])
                setTimeout(() => consumer.resume([{ topic:jobInfo.connectionObject['topic'] }]), e.retryAfter * 1000)
            }
        },
    })
        
      jobObject.privateComp = consumer;

      console.info(`Listening for the topic: ${jobInfo.connectionObject['topic']} messages,worker id: ${process.env.WORKER_ID}`);;
    }

    dispose(jobObject:{emiter:EventEmitter,privateComp:any,jobInfo:IJobInformation}):Promise<boolean>{
      return new Promise<boolean>((resolve,reject)=>{
        try{
         jobObject.privateComp.pause([{ topic:jobObject.jobInfo.connectionObject['topic'] }])
         resolve(true)
        }
        catch(ex){
          reject(ex)
        }
      })
    }

}