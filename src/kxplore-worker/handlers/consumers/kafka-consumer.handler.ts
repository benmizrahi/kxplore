import { IConsumer } from "./IConsumer";
import { IJobInformation } from "../../../kxplore-shared-models/job-details";

import { queue } from 'async';
import { Client, Consumer, Offset,HighLevelConsumer } from 'kafka-node';
import { isArray } from 'util';
import { Func } from 'mocha';
import { IEnvironment } from '../../../kxplore-shared-models/envierment';
import { EventEmitter } from "events";
import { AbstractConsumer } from "../abstract-consumer.hanler";

export class KafkaConsumerHandler extends AbstractConsumer {

    init(jobInfo: IJobInformation,jobObject:{emiter:EventEmitter,privateComp:any}) {
        const consumer = new ConsumerWapper();
        consumer.consume<any>(jobInfo.payload['topic'],jobInfo.uuid,jobInfo.env,null,jobObject.emiter);
        jobObject.privateComp = consumer;
        
    }

    dispose(jobObject:{emiter:EventEmitter,privateComp:any}){
        (jobObject.privateComp as ConsumerWapper).pause()
    }

}

export class ConsumerWapper {
    client: Client;
    consumer: Consumer;
    offset: Offset;
    listener:Func

    isActive = false;

    private connect (topic:string,job_uuid:string,environment:IEnvironment,offsets:Array<any>) {
        
        let self = this;

        self.client = new Client(environment.props['zookeeperUrl'], environment.props['groupId'] + '___' + job_uuid);
        let offset_values = offsets ? Object.keys(offsets[topic]).map(x=>{
            return {
                topic:topic,
                partition:parseInt(x),
                offset:offsets[topic][x]
            }
        }) : null
        if(offset_values){
            self.consumer = new Consumer(this.client,offset_values , environment.props);
        }else{
            self.consumer = new HighLevelConsumer(this.client,[{topic:topic}] , environment.props);
        }
        
        self.offset = new Offset(self.client);
        
        console.info(`Listening for the ${topic} messages...`);
    }

    public consume<T>(topic:string,userId:string,environment:IEnvironment,offsets:Array<any>,eventEmitter:EventEmitter): void {  
        let self = this;
        self.connect(topic,userId,environment,offsets);

        process.on('SIGINT', () => self.consumer.close(true, () => process.exit()));

        self.consumer.on('error', (err: any) => {
            const failedToRebalanceConsumerError = !err.message || err.message && err.message.includes('FailedToRebalanceConsumerError') 
            || err.stack.includes('FailedToRebalanceConsumerError');
            const leaderNotAvailable = err.message && err.message.includes('LeaderNotAvailable');
            if (failedToRebalanceConsumerError || leaderNotAvailable) {
                return setImmediate(() => self.consumer.close(true, () => self.connect(topic,userId,environment,offsets)));
            }
            console.error(`Kafka error happened: ${JSON.stringify(err)}`);
        });

        self.consumer.on('offsetOutOfRange', function (topicObj: any) {
            console.error(`offsetOutOfRange error!`)
        });

        const q = queue(function(payload: T, cb: any) {
            setImmediate(() => eventEmitter.emit('NEW_DATA',{payload:payload}));
        }, environment.props['threadCount']);

        q.drain = function() {
            self.consumer.resume();
        };
        self.listener = this.messageListener(q)
        self.consumer.on('message',self.listener);

        self.isActive = true;
    }

    private messageListener (q: any) {
        return (messageWrapper: any)  => {
            try{
            let message: any = messageWrapper.value.split('\n').map(x=>JSON.parse(x));
            if(!isArray(message))
                message = [message]
                message = message.map(x=>{
                    return {
                        partition:messageWrapper.partition,
                        offset:messageWrapper.offset,
                        message:x
                    }
            })
            q.push(message);
            this.consumer.pause();
            }
            catch(e){
                 console.log(1);
            }
        };
    }


    public pause(){
        if(!this.isActive) return;
        this.isActive = false;
        this.consumer.removeListener('message',this.listener)
        this.consumer.pause()
    }

    public resume(){
        this.isActive = true;
        this.consumer.resume()
        this.consumer.on('message',this.listener)
    }
}