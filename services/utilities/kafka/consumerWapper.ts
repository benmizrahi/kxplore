import { queue } from 'async';
import { Client, HighLevelConsumer, Offset } from 'kafka-node';
import { isArray } from 'util';
import { Func } from 'mocha';

export class Consumer {
    client: Client;
    consumer: HighLevelConsumer;
    offset: Offset;

    listener:Func

    isActive = false;

    private connect (topic: string,connectionString:string,clientId:string) {
        let self = this;

        self.client = new Client(connectionString, clientId);
        self.consumer = new HighLevelConsumer(this.client, [{ topic: topic }], { 
            groupId: clientId,
            fetchMaxWaitMs: 100,
            fetchMinBytes: 1,
            fetchMaxBytes: 1024 * 10,
            fromOffset: true,
            fromBeginning: false, 
            autoCommit: true,
            autoCommitMsgCount: 100,
            autoCommitIntervalMs: 5000});
        self.offset = new Offset(self.client);
        
        console.info(`Listening for the ${topic} messages...`);
    }


    public consume<T>(topic: string,env:string,connectionString:string,groupId:string, threads: number, callback: (msg: T,topic:string,env:string, done: Function,context:any) => void,context:any): void {
        let self = this;
        self.connect(topic,connectionString,groupId);

        process.on('SIGINT', () => self.consumer.close(true, () => process.exit()));

        self.consumer.on('error', (err: any) => {
            const failedToRebalanceConsumerError = err.message && err.message.includes('FailedToRebalanceConsumerError');
            const leaderNotAvailable = err.message && err.message.includes('LeaderNotAvailable');
            if (failedToRebalanceConsumerError || leaderNotAvailable) {
                return setImmediate(() => self.consumer.close(true, () => self.connect(topic,connectionString,groupId)));
            }
            console.error(`Kafka error happened: ${JSON.stringify(err)}`);
        });

        self.consumer.on('offsetOutOfRange', function (topicObj: any) {
            topicObj.maxNum = 2;
            self.offset.fetch([topicObj], function (err: any, offsets: any) {
                if (err) return console.error(err);
                const min = Math.min(offsets[topicObj.topic][topicObj.partition]);
                self.consumer.setOffset(topicObj.topic, topicObj.partition, min);
            });
        });

        const q = queue(function(payload: T, cb: any) {
            setImmediate(() => callback(payload,topic,env, cb,context));
        }, threads);

        q.drain = function() {
            self.consumer.resume();
        };
        self.listener = this.messageListener(q)
        self.consumer.on('message',self.listener);

        self.isActive = true;
    }

    private messageListener (q: any) {
        return (messageWrapper: any)  => {
            let message: any = JSON.parse(messageWrapper.value);
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
        };
    }



    public pause(){
        this.isActive = false;
        this.consumer.pause();
        this.consumer.removeListener('message',this.listener)
    }

    public resume(){
        this.isActive = true;
        this.consumer.resume()
        this.consumer.on('message',this.listener)
    }
}