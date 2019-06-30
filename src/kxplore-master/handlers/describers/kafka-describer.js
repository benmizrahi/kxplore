"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var kafka = require("kafka-node");
var KafkaDescibable = /** @class */ (function () {
    function KafkaDescibable() {
    }
    KafkaDescibable.prototype.describe = function (env) {
        return new Promise(function (resolve, reject) {
            var client = new kafka.Client(env.props['zookeeperUrl']);
            client.once('connect', function () {
                client.loadMetadataForTopics([], function (error, results) {
                    if (error) {
                        reject("unable to get env information " + env + ", error: " + error);
                        return;
                    }
                    else {
                        resolve({ data: results });
                    }
                });
            });
        });
    };
    return KafkaDescibable;
}());
exports.KafkaDescibable = KafkaDescibable;
//# sourceMappingURL=kafka-describer.js.map