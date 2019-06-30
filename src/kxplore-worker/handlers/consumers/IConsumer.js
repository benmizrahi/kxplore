"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var enums_1 = require("../../../kxplore-shared-models/enums");
var kafka_consumer_handler_1 = require("./kafka-consumer.handler");
function matchPatten(env) {
    switch (env.type) {
        case enums_1.TargetType.Kafka:
            return new kafka_consumer_handler_1.KafkaConsumerHandler();
        default:
            return new kafka_consumer_handler_1.KafkaConsumerHandler();
    }
}
exports.matchPatten = matchPatten;
//# sourceMappingURL=IConsumer.js.map