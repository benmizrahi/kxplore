"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const async_1 = require("async");
const kafka_node_1 = require("kafka-node");
const util_1 = require("util");
class Consumer {
    constructor() {
        this.isActive = false;
    }
    connect(topic, connectionString, clientId) {
        let self = this;
        self.client = new kafka_node_1.Client(connectionString, clientId);
        self.consumer = new kafka_node_1.HighLevelConsumer(this.client, [{ topic: topic }], {
            groupId: clientId,
            fetchMaxWaitMs: 100,
            fetchMinBytes: 1,
            fetchMaxBytes: 1024 * 10,
            fromOffset: true,
            fromBeginning: false,
            autoCommit: true,
            autoCommitMsgCount: 100,
            autoCommitIntervalMs: 5000
        });
        self.offset = new kafka_node_1.Offset(self.client);
        console.info(`Listening for the ${topic} messages...`);
    }
    consume(topic, env, connectionString, groupId, threads, callback, context) {
        let self = this;
        self.connect(topic, connectionString, groupId);
        process.on('SIGINT', () => self.consumer.close(true, () => process.exit()));
        self.consumer.on('error', (err) => {
            const failedToRebalanceConsumerError = err.message && err.message.includes('FailedToRebalanceConsumerError');
            const leaderNotAvailable = err.message && err.message.includes('LeaderNotAvailable');
            if (failedToRebalanceConsumerError || leaderNotAvailable) {
                return setImmediate(() => self.consumer.close(true, () => self.connect(topic, connectionString, groupId)));
            }
            console.error(`Kafka error happened: ${JSON.stringify(err)}`);
        });
        self.consumer.on('offsetOutOfRange', function (topicObj) {
            topicObj.maxNum = 2;
            self.offset.fetch([topicObj], function (err, offsets) {
                if (err)
                    return console.error(err);
                const min = Math.min(offsets[topicObj.topic][topicObj.partition]);
                self.consumer.setOffset(topicObj.topic, topicObj.partition, min);
            });
        });
        const q = async_1.queue(function (payload, cb) {
            setImmediate(() => callback(payload, topic, env, cb, context));
        }, threads);
        q.drain = function () {
            self.consumer.resume();
        };
        self.listener = this.messageListener(q);
        self.consumer.on('message', self.listener);
        self.isActive = true;
    }
    messageListener(q) {
        return (messageWrapper) => {
            let message = JSON.parse(messageWrapper.value);
            if (!util_1.isArray(message))
                message = [message];
            message = message.map(x => {
                return {
                    partition: messageWrapper.partition,
                    offset: messageWrapper.offset,
                    message: x
                };
            });
            q.push(message);
            this.consumer.pause();
        };
    }
    pause() {
        this.isActive = false;
        this.consumer.pause();
        this.consumer.removeListener('message', this.listener);
    }
    resume() {
        this.isActive = true;
        this.consumer.resume();
        this.consumer.on('message', this.listener);
    }
}
exports.Consumer = Consumer;
//# sourceMappingURL=consumerWapper.js.map