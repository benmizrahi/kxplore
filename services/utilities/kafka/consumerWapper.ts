import { queue } from 'async';
import { Client, Consumer, Offset } from 'kafka-node';
import { isArray } from 'util';
import { Func } from 'mocha';

export class ConsumerWapper {
    client: Client;
    consumer: Consumer;
    offset: Offset;

    listener:Func

    isActive = false;

    private connect (topic: string,connectionString:string,clientId:string,envOptions,offsets) {
        let self = this;

        self.client = new Client(connectionString, clientId);
        let offset_values = Object.keys(offsets[topic]).map(x=>{
            return {
                topic:topic,
                partition:parseInt(x),
                offset:offsets[topic][x]
            }
        })
        self.consumer = new Consumer(this.client,[offset_values[0]] , envOptions);
        self.offset = new Offset(self.client);
        
        console.info(`Listening for the ${topic} messages...`);
    }


    public consume<T>(topic: string,env:string,connectionString:string,groupId:string, threads: number,envOptions:any,offsets:Array<any>, callback: (msg: T,topic:string,env:string, done: Function,context:any) => void,context:any): void {  
        let self = this;
        self.connect(topic,connectionString,groupId,envOptions,offsets);

        process.on('SIGINT', () => self.consumer.close(true, () => process.exit()));

        self.consumer.on('error', (err: any) => {
            const failedToRebalanceConsumerError = err.message && err.message.includes('FailedToRebalanceConsumerError') 
            || err.stack.includes('FailedToRebalanceConsumerError');
            const leaderNotAvailable = err.message && err.message.includes('LeaderNotAvailable');
            if (failedToRebalanceConsumerError || leaderNotAvailable) {
                return setImmediate(() => self.consumer.close(true, () => self.connect(topic,connectionString,groupId,envOptions,offsets)));
            }
            console.error(`Kafka error happened: ${JSON.stringify(err)}`);
        });

        self.consumer.on('offsetOutOfRange', function (topicObj: any) {
            console.error(`offsetOutOfRange error!`)
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


    // private resetConsumerOffsets = (topic,offsets) => {
    //     return new Promise<boolean>((resolve,reject)=>{
    //         let offsets =  Object.keys(offsets[topic]).map(x=>{
    //             return {
    //                 topic:topic,
    //                 partition:x,
    //                 offset:offsets[topic][x][0]
    //             }
    //         })
    //     })
    // }

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