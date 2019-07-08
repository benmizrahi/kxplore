"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("../../../kxplore-shared-models/enums");
var kafka_consumer_handler_1 = require("./kafka-consumer.handler");
var push_filter_workers_1 = require("../../consumer-strategy/strategies/push-filter-workers");
exports.strategyFactory = function (jobData) {
    return new push_filter_workers_1.PushFilterWorker(5, jobData.connectionObject.query);
};
function matchPatten(jobData) {
    switch (jobData.env.type) {
        case enums_1.TargetType.Kafka:
            return new kafka_consumer_handler_1.KafkaConsumerHandler(exports.strategyFactory(jobData));
        default:
            return new kafka_consumer_handler_1.KafkaConsumerHandler(exports.strategyFactory(jobData));
    }
}
exports.matchPatten = matchPatten;
//# sourceMappingURL=IConsumer.js.map