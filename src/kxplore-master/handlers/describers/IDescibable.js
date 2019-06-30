"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kafka_describer_1 = require("./kafka-describer");
var enums_1 = require("../../../kxplore-shared-models/enums");
function matchPatten(env) {
    switch (env.type) {
        case enums_1.TargetType.Kafka:
            return new kafka_describer_1.KafkaDescibable();
        default:
            return new kafka_describer_1.KafkaDescibable();
    }
}
exports.matchPatten = matchPatten;
//# sourceMappingURL=IDescibable.js.map