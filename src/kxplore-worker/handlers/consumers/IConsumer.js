"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("../../../kxplore-shared-models/enums");
var kafka_consumer_handler_1 = require("./kafka-consumer.handler");
var push_filter_workers_1 = require("../../consumer-strategy/strategies/push-filter-workers");
exports.strategyFactory = function (type) {
    return new push_filter_workers_1.PushFilterWorker(5, "select data,counter from ? where counter > 0.7");
};
function matchPatten(env, strategy) {
    switch (env.type) {
        case enums_1.TargetType.Kafka:
            return new kafka_consumer_handler_1.KafkaConsumerHandler(exports.strategyFactory(strategy));
        default:
            return new kafka_consumer_handler_1.KafkaConsumerHandler(exports.strategyFactory(strategy));
    }
}
exports.matchPatten = matchPatten;
//# sourceMappingURL=IConsumer.js.map