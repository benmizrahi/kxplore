"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var async_1 = require("async");
var kafka_node_1 = require("kafka-node");
var util_1 = require("util");
var abstract_consumer_hanler_1 = require("../abstract-consumer.hanler");
var KafkaConsumerHandler = /** @class */ (function (_super) {
    __extends(KafkaConsumerHandler, _super);
    function KafkaConsumerHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KafkaConsumerHandler.prototype.init = function (jobInfo, jobObject) {
        var consumer = new ConsumerWapper();
        consumer.consume(jobInfo.payload['topic'], jobInfo.uuid, jobInfo.env, null, jobObject.emiter);
        jobObject.privateComp = consumer;
    };
    KafkaConsumerHandler.prototype.dispose = function (jobObject) {
        jobObject.privateComp.pause();
    };
    return KafkaConsumerHandler;
}(abstract_consumer_hanler_1.AbstractConsumer));
exports.KafkaConsumerHandler = KafkaConsumerHandler;
var ConsumerWapper = /** @class */ (function () {
    function ConsumerWapper() {
        this.isActive = false;
    }
    ConsumerWapper.prototype.connect = function (topic, job_uuid, environment, offsets) {
        var self = this;
        var assign = Object.assign({
            groupId: "kxplore__group__" + job_uuid,
            fromOffset: 'latest'
        }, environment.props.propeties);
        self.consumer = new kafka_node_1.ConsumerGroup(Object.assign({ id: "consumer_" + process.env.WORKER_ID }, assign), [topic]);
        console.info("Listening for the topic: " + topic + " messages,worker id: " + process.env.WORKER_ID);
    };
    ConsumerWapper.prototype.consume = function (topic, userId, environment, offsets, eventEmitter) {
        var self = this;
        self.connect(topic, userId, environment, offsets);
        process.on('SIGINT', function () { return self.consumer.close(true, function () { return process.exit(); }); });
        self.consumer.on('error', function (err) {
            var failedToRebalanceConsumerError = !err.message || err.message && err.message.includes('FailedToRebalanceConsumerError')
                || err.stack.includes('FailedToRebalanceConsumerError');
            var leaderNotAvailable = err.message && err.message.includes('LeaderNotAvailable');
            if (failedToRebalanceConsumerError || leaderNotAvailable) {
                return setImmediate(function () { return self.consumer.close(true, function () { return self.connect(topic, userId, environment, offsets); }); });
            }
            console.error("Kafka error happened: " + JSON.stringify(err));
        });
        var q = async_1.queue(function (payload, cb) {
            setImmediate(function () {
                eventEmitter.emit('NEW_DATA', { payload: payload });
                console.debug("emit data on worker: " + process.env.WORKER_ID);
                cb();
            });
        }, 1);
        q.drain = function () {
            self.consumer.resume();
        };
        self.listener = this.messageListener(q);
        self.consumer.on('message', self.listener);
        self.isActive = true;
    };
    ConsumerWapper.prototype.messageListener = function (q) {
        var _this = this;
        return function (messageWrapper) {
            try {
                console.debug("worker consumer: " + process.env.WORKER_ID + " - processing data! ");
                var message = messageWrapper.value.split('\n').map(function (x) { return JSON.parse(x); });
                if (!util_1.isArray(message))
                    message = [message];
                message = message.map(function (x) {
                    return {
                        partition: messageWrapper.partition,
                        offset: messageWrapper.offset,
                        message: x
                    };
                });
                q.push(message);
                _this.consumer.pause();
            }
            catch (e) {
                console.log(1);
            }
        };
    };
    ConsumerWapper.prototype.pause = function () {
        if (!this.isActive)
            return;
        this.isActive = false;
        this.consumer.removeListener('message', this.listener);
        this.consumer.pause();
    };
    ConsumerWapper.prototype.resume = function () {
        this.isActive = true;
        this.consumer.resume();
        this.consumer.on('message', this.listener);
    };
    return ConsumerWapper;
}());
exports.ConsumerWapper = ConsumerWapper;
//# sourceMappingURL=kafka-consumer.handler.js.map