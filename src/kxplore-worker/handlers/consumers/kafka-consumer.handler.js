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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var kafka = require('kafka-node');
var abstract_consumer_handler_1 = require("../abstract-consumer.handler");
var Queue = require('better-queue');
var KafkaConsumerHandler = /** @class */ (function (_super) {
    __extends(KafkaConsumerHandler, _super);
    function KafkaConsumerHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KafkaConsumerHandler.prototype.init = function (jobInfo, jobObject) {
        var _this = this;
        var commitManager = new CommitManager();
        var onRebalance = function (err, assignments) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (err.code === kafka.CODES.ERRORS.ERR__ASSIGN_PARTITIONS) {
                    consumerGroup.assign(assignments);
                }
                else if (err.code === kafka.CODES.ERRORS.ERR__REVOKE_PARTITIONS) {
                    if (paused) {
                        consumerGroup.resume(assignments);
                        paused = false;
                    }
                    q.remove(function (d, p) { return true; });
                    consumerGroup.unassign();
                    commitManager.onRebalance();
                }
                else {
                    console.error("Rebalace error : " + err);
                }
                return [2 /*return*/];
            });
        }); };
        var paused = false;
        var maxQueueSize = jobInfo.env.props['queue-size-per-worker'] || 100;
        var options = {
            // connect directly to kafka broker (instantiates a KafkaClient)
            kafkaHost: jobInfo.env.props['kafkaHost'],
            host: jobInfo.env.props['zookeeper'],
            groupId: "kxplore_consumer___" + jobInfo.connectionObject.uId,
            sessionTimeout: jobInfo.env.props['sessionTimeout'],
            fetchMaxBytes: 1024 * 1024,
            fetchMaxWaitMs: 5000,
            fetchMinBytes: 1,
            // An array of partition assignment protocols ordered by preference. 'roundrobin' or 'range' string for
            // built ins (see below to pass in custom assignment protocol)
            protocol: ['roundrobin'],
            // Offsets to use for new groups other options could be 'earliest' or 'none'
            // (none will emit an error if no offsets were saved) equivalent to Java client's auto.offset.reset
            fromOffset: jobInfo.connectionObject.isOldest ? "earliest" : "latest",
            // how to recover from OutOfRangeOffset error (where save offset is past server retention)
            // accepts same value as fromOffset
            outOfRangeOffset: 'latest',
            'rebalance_cb': onRebalance.bind(this),
            'enable.auto.commit': false
        };
        var consumerGroup = new kafka.ConsumerGroup(options, jobInfo.connectionObject['topic']);
        consumerGroup.on('ready', function () {
            commitManager.start(consumerGroup);
        });
        var q = new Queue(function (batch, done) { return __awaiter(_this, void 0, void 0, function () {
            var time, data, results, e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, 3, 4]);
                        time = new Date();
                        data = batch.map(function (message) { return JSON.parse(message.value); });
                        return [4 /*yield*/, this.strategy.maniplute({ recivedTimestamp: time, data: data })];
                    case 1:
                        results = _a.sent();
                        results.outputEmiter.emit('INTERVAL_DATA_EXPORT', { payload: results.messages, metaColumns: results.metaColumns });
                        batch.map(function (data) { return commitManager.notifyStartProcessing(data); });
                        done();
                        return [3 /*break*/, 4];
                    case 2:
                        e_1 = _a.sent();
                        done();
                        return [3 /*break*/, 4];
                    case 3:
                        batch.map(function (data) { return commitManager.notifyStartProcessing(data); });
                        return [7 /*endfinally*/];
                    case 4: return [2 /*return*/];
                }
            });
        }); }, { batchSize: maxQueueSize });
        consumerGroup.on('message', function (messageWrapper) {
            q.push(messageWrapper);
        });
        q.on('drain', function () {
            consumerGroup.resume();
        });
        consumerGroup.on('error', function (err) {
            var failedToRebalanceConsumerError = err.message && err.message.includes('FailedToRebalanceConsumerError');
            var leaderNotAvailable = err.message && err.message.includes('LeaderNotAvailable');
            if (failedToRebalanceConsumerError || leaderNotAvailable) {
                return setImmediate(function () { return consumerGroup.close(true, function () { return _this.init(jobInfo, jobObject); }); });
            }
            console.error("Kafka error happened: " + JSON.stringify(err));
        });
        consumerGroup.on('offsetOutOfRange', function (topicObj) {
        });
        jobObject.privateComp = consumerGroup;
        this.strategy.outputEmitter.on('INTERVAL_DATA_EXPORT', function (payload) {
            jobObject.emiter.emit("JOB_DATA_" + jobInfo.job_uuid, payload);
        });
        console.info("Listening for the topic: " + jobInfo.connectionObject['topic'] + " messages,worker id: " + process.env.WORKER_ID);
        ;
    };
    KafkaConsumerHandler.prototype.dispose = function (jobObject) {
        jobObject.privateComp.close(true, function (err) {
            if (err)
                console.error("error while stoping consumer " + JSON.stringify(err));
            else {
                console.info("consumer stoped on worker id: " + process.env.WORKER_ID);
            }
        });
    };
    return KafkaConsumerHandler;
}(abstract_consumer_handler_1.AbstractConsumer));
exports.KafkaConsumerHandler = KafkaConsumerHandler;
var CommitManager = /** @class */ (function () {
    function CommitManager() {
        var _this = this;
        this.COMMIT_TIME_INTERVAL = 5000;
        this.partitionsData = {};
        this.lastCommited = [];
        this.consumer = null;
        this.commitProcessedOffsets = function () { return __awaiter(_this, void 0, void 0, function () {
            var offsetsToCommit, key, pi, npi, lastProcessedRecord;
            return __generator(this, function (_a) {
                try {
                    offsetsToCommit = [];
                    for (key in this.partitionsData) {
                        pi = this.partitionsData[key]
                            .findIndex(function (record) { return record.done; });
                        npi = this.partitionsData[key]
                            .findIndex(function (record) { return !record.done; });
                        lastProcessedRecord = npi > 0 ?
                            this.partitionsData[key][npi - 1] :
                            (pi > -1 ?
                                this.partitionsData[key][this.partitionsData[key].length - 1] :
                                null);
                        if (lastProcessedRecord) {
                            offsetsToCommit.push({
                                partition: key - 0,
                                offset: lastProcessedRecord.offset,
                                topic: lastProcessedRecord.topic
                            });
                            // remove commited records from array
                            this.partitionsData[key]
                                .splice(0, this.partitionsData[key].indexOf(lastProcessedRecord) + 1);
                        }
                    }
                    if (offsetsToCommit.length > 0) {
                        this.consumer.commit(offsetsToCommit);
                    }
                    this.lastCommited = offsetsToCommit.length > 0 ?
                        offsetsToCommit :
                        this.lastCommited;
                    Promise.resolve();
                }
                catch (e) {
                    Promise.reject(e);
                }
                return [2 /*return*/];
            });
        }); };
        this.onRebalance = function () {
            _this.partitionsData = {};
        };
        this.getLastCommited = function () {
            return _this.lastCommited;
        };
        this.resetOffsets = function (client, topic, consumer) {
            var offset = new kafka.Offset(client);
            offset.fetchLatestOffsets([topic], function (err, offsets) {
                if (err) {
                    console.log("error fetching latest offsets " + err);
                    return;
                }
                var latest = 1;
                Object.keys(offsets[topic]).forEach(function (o) {
                    latest = offsets[topic][o] > latest ? offsets[topic][o] : latest;
                });
                consumer.setOffset(topic, 0, latest - 1);
            });
        };
    }
    CommitManager.prototype.start = function (consumer) {
        var _this = this;
        this.consumer = consumer;
        setInterval(function () {
            _this.commitProcessedOffsets();
        }, this.COMMIT_TIME_INTERVAL);
    };
    CommitManager.prototype.notifyStartProcessing = function (data) {
        var partition = data.partition;
        var offset = data.offset;
        var topic = data.topic;
        this.partitionsData[partition] = this.partitionsData[partition] || [];
        this.partitionsData[partition].push({
            offset: offset,
            topic: topic,
            done: false
        });
    };
    CommitManager.prototype.notifyFinishedProcessing = function (data) {
        var partition = data.partition;
        var offset = data.offset;
        this.partitionsData[partition] = this.partitionsData[partition] || [];
        var record = this.partitionsData[partition].filter(function (record) { return record.offset === offset; })[0];
        if (record) {
            record.done = true;
        }
    };
    return CommitManager;
}());
//# sourceMappingURL=kafka-consumer.handler.js.map