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
var kafka = require('kafka-node');
var abstract_consumer_hanler_1 = require("../abstract-consumer.hanler");
var KafkaConsumerHandler = /** @class */ (function (_super) {
    __extends(KafkaConsumerHandler, _super);
    function KafkaConsumerHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KafkaConsumerHandler.prototype.init = function (jobInfo, jobObject) {
        var options = {
            // connect directly to kafka broker (instantiates a KafkaClient)
            kafkaHost: '127.0.0.1:9092',
            groupId: 'test',
            autoCommit: true,
            autoCommitIntervalMs: 5000,
            sessionTimeout: 15000,
            fetchMaxBytes: 10 * 1024 * 1024,
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
            jobObject.emiter.emit('NEW_DATA', { payload: message });
        });
        consumerGroup.on('error', function onError(error) {
            console.error(error);
        });
        console.info("Listening for the topic: " + jobInfo.payload['topic'] + " messages,worker id: " + process.env.WORKER_ID);
        ;
    };
    KafkaConsumerHandler.prototype.dispose = function (jobObject) {
        jobObject.privateComp.stop();
    };
    return KafkaConsumerHandler;
}(abstract_consumer_hanler_1.AbstractConsumer));
exports.KafkaConsumerHandler = KafkaConsumerHandler;
//# sourceMappingURL=kafka-consumer.handler.js.map