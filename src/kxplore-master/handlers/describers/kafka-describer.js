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
    KafkaDescibable.prototype.preJobOperation = function (payload) {
        return new Promise(function (resolve, reject) {
            var client = new kafka.Client(payload.env.props['zookeeperUrl']);
            var offset = new kafka.Offset(client);
            offset.fetchLatestOffsets([payload.connectionObject.topic], function (err, offsets) {
                if (err) {
                    console.log("error fetching latest offsets " + err);
                    return;
                }
                var latest = 1;
                Object.keys(offsets[payload.connectionObject.topic]).forEach(function (o) {
                    latest = offsets[payload.connectionObject.topic][o] > latest ? offsets[payload.connectionObject.topic][o] : latest;
                });
                resolve(true);
            });
        });
    };
    return KafkaDescibable;
}());
exports.KafkaDescibable = KafkaDescibable;
//# sourceMappingURL=kafka-describer.js.map