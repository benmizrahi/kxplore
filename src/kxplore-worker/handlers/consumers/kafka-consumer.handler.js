"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
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
var kafkajs_1 = require("kafkajs");
var abstract_consumer_handler_1 = require("../abstract-consumer.handler");
var KafkaConsumerHandler = /** @class */ (function (_super) {
    __extends(KafkaConsumerHandler, _super);
    function KafkaConsumerHandler() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    KafkaConsumerHandler.prototype.init = function (jobInfo, jobObject) {
        return __awaiter(this, void 0, void 0, function () {
            var kafka, consumer;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        kafka = new kafkajs_1.Kafka({
                            clientId: 'kxplore-app',
                            brokers: jobInfo.env.props['kafkaHost'].split(','),
                            connectionTimeout: 3000,
                            requestTimeout: 25000
                        });
                        consumer = kafka.consumer({ groupId: "kxplore_consumer___" + jobInfo.connectionObject.uId + "__" + jobInfo.connectionObject['topic'] });
                        return [4 /*yield*/, consumer.connect()];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, consumer.subscribe({ topic: jobInfo.connectionObject['topic'], fromBeginning: jobInfo.connectionObject.isOldest })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, consumer.run({
                                eachBatch: function (_a) {
                                    var batch = _a.batch, resolveOffset = _a.resolveOffset, heartbeat = _a.heartbeat, isRunning = _a.isRunning, isStale = _a.isStale;
                                    return __awaiter(_this, void 0, void 0, function () {
                                        var results, e_1;
                                        var _this = this;
                                        return __generator(this, function (_b) {
                                            switch (_b.label) {
                                                case 0:
                                                    _b.trys.push([0, 3, , 4]);
                                                    return [4 /*yield*/, this.strategy.maniplute({ data: batch.messages.map(function (message) { return JSON.parse(message.value.toString('utf8')); }), recivedTimestamp: new Date() })];
                                                case 1:
                                                    results = _b.sent();
                                                    jobObject.emiter.emit("JOB_DATA_" + jobInfo.job_uuid, { payload: results.messages, metaColumns: results.metaColumns });
                                                    batch.messages.map(function (message) { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                                                        switch (_a.label) {
                                                            case 0: return [4 /*yield*/, resolveOffset(message.offset)];
                                                            case 1: return [2 /*return*/, _a.sent()];
                                                        }
                                                    }); }); });
                                                    return [4 /*yield*/, heartbeat()];
                                                case 2:
                                                    _b.sent();
                                                    return [3 /*break*/, 4];
                                                case 3:
                                                    e_1 = _b.sent();
                                                    consumer.pause([{ topic: jobInfo.connectionObject['topic'] }]);
                                                    setTimeout(function () { return consumer.resume([{ topic: jobInfo.connectionObject['topic'] }]); }, e_1.retryAfter * 1000);
                                                    return [3 /*break*/, 4];
                                                case 4: return [2 /*return*/];
                                            }
                                        });
                                    });
                                },
                            })];
                    case 3:
                        _a.sent();
                        jobObject.privateComp = consumer;
                        console.info("Listening for the topic: " + jobInfo.connectionObject['topic'] + " messages,worker id: " + process.env.WORKER_ID);
                        ;
                        return [2 /*return*/];
                }
            });
        });
    };
    KafkaConsumerHandler.prototype.dispose = function (jobObject) {
        return new Promise(function (resolve, reject) {
            try {
                jobObject.privateComp.pause([{ topic: jobObject.jobInfo.connectionObject['topic'] }]);
                resolve(true);
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    return KafkaConsumerHandler;
}(abstract_consumer_handler_1.AbstractConsumer));
exports.KafkaConsumerHandler = KafkaConsumerHandler;
//# sourceMappingURL=kafka-consumer.handler.js.map