"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../interfaces/enums");
const di_1 = require("@decorators/di");
const kafka = require("kafka-node");
const loggerHandler_1 = require("./loggerHandler");
const timers_1 = require("timers");
const dbHandler_1 = require("./dbHandler");
const consumerWapper_1 = require("../services/utilities/kafka/consumerWapper");
let KafkaHandler = class KafkaHandler {
    constructor(config, logger, dbHandler) {
        this.config = config;
        this.logger = logger;
        this.dbHandler = dbHandler;
        this.connections = {};
        this.envierments = null;
        this.initKafka = ({ env, topic, dataCallback }) => {
            return new Promise((resolve, reject) => {
                const id = this.guid();
                if (this.connections[env] && this.connections[env].topics[topic] && this.connections[env].topics[topic].instance) {
                    this.connections[env].topics[topic].callbacks[id] = dataCallback;
                    this.handlePoolMessages([], this.connections[env].topics[topic].instance, { env: env, topic: topic });
                    if (!this.connections[env].topics[topic].instance.isActive
                        && this.connections[env].topics[topic].pool.length == 0) {
                        this.connections[env].topics[topic].instance.resume();
                    }
                    resolve(id);
                    return;
                }
                let kafkaConfig = this.envierments[env];
                const consumer = new consumerWapper_1.Consumer();
                consumer.consume(topic, env, kafkaConfig['zookeeperUrl'], kafkaConfig['groupId'] + id, 4, this.topicMessageHandler, this);
                if (!this.connections[env])
                    this.connections[env] = { topics: {} };
                if (!this.connections[env].topics[topic])
                    this.connections[env].topics[topic] = { instance: consumer, pool: [], interval: null, reconnect: false, filter: null, callbacks: {} };
                this.connections[env].topics[topic].callbacks[id] = dataCallback;
                console.log("Started consumer successfully");
                resolve(id);
                //})
            });
        };
        this.handlePoolMessages = (msgs, instance, { env, topic }) => {
            this.connections[env].topics[topic].pool = this.connections[env].topics[topic].pool.concat(msgs);
            if (this.connections[env].topics[topic].pool.length > this.config.kafkaConfig.messagePool
                && this.connections[env].topics[topic].instance.isActive) {
                console.log(`pool is full stoping consumer!`);
                this.connections[env].topics[topic].instance.pause();
            }
            if (!this.connections[env].topics[topic].interval) {
                console.log(`creating interval...`);
                this.connections[env].topics[topic].interval = setInterval(() => {
                    let clients = Object.keys(this.connections[env].topics[topic].callbacks);
                    if (clients.length == 0) {
                        console.log(`no listeners found clearing interval...`);
                        timers_1.clearInterval(this.connections[env].topics[topic].interval);
                        this.connections[env].topics[topic].interval = null;
                        this.connections[env].topics[topic].instance.pause();
                    }
                    clients.forEach(x => {
                        if (this.connections[env].topics[topic].callbacks[x])
                            this.connections[env].topics[topic].callbacks[x](this.connections[env].topics[topic].pool.splice(0, this.config.kafkaConfig.poolCount));
                    });
                    if (this.connections[env].topics[topic].pool.length < this.config.kafkaConfig.minMessage
                        && !this.connections[env].topics[topic].instance.isActive) {
                        console.log(`pool is empty restrating consumer...`);
                        this.connections[env].topics[topic].instance.resume();
                    }
                }, this.config.kafkaConfig.intervalMs);
            }
        };
        this.initEnvs = () => __awaiter(this, void 0, void 0, function* () {
            let db = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `select envName,props from KafkaLooker.dim_envierments` });
            this.envierments = {};
            db.results.forEach(row => {
                this.envierments[row.envName] = JSON.parse(row.props);
            });
        });
        this.resetConsumerOffsets = (env, topic) => {
            return new Promise((resolve, reject) => {
                let client = new kafka.Client(env.zookeeperUrl);
                var offset = new kafka.Offset(client);
                var consumer = new kafka.HighLevelConsumer(client, [
                    {
                        topic: topic
                    }
                ], {
                    groupId: env.groupId,
                    autoCommit: false
                });
                offset.fetchLatestOffsets([topic], (err, offsets) => {
                    if (err) {
                        console.log(`error fetching latest offsets ${err}`);
                        reject(err);
                    }
                    else {
                        var latest = 1;
                        Object.keys(offsets[topic]).forEach(o => {
                            latest = offsets[topic][o] > latest ? offsets[topic][o] : latest;
                        });
                        consumer.setOffset(topic, 0, latest - 1);
                    }
                    resolve(true);
                });
            });
            // let consumer = new kafka.HighLevelConsumer(
            //         consumerClient,
            //         [
            //             { topic: 'myTopic', partition: 0, fromOffset: -1 }
            //         ],
            //         {
            //             autoCommit: false
            //         }
            // );
        };
        this.getOffsetsInTimeStamp = (env, topic, partitons, timestamp) => {
            return new Promise((resolve, reject) => {
                let client = new kafka.Client(env.zookeeperUrl);
                var offset = new kafka.Offset(client);
                offset.fetch(partitons.map(x => {
                    return { topic: topic, partition: x, time: timestamp, maxNum: 1 };
                }), (err, data) => {
                    if (err) {
                        console.error(err);
                        reject(err);
                    }
                    else {
                        resolve(data);
                    }
                });
            });
        };
    }
    handle(handleParams) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (!this.envierments)
                yield this.initEnvs();
            switch (handleParams.action) {
                case enums_1.KafkaAction.connect:
                    try {
                        const id = yield this.initKafka(handleParams.payload);
                        console.info(`instnace of ${JSON.stringify(handleParams.payload)} created sucssesfully!`);
                        resolve({ status: true, action: handleParams.action, results: id });
                    }
                    catch (e) {
                        reject(e);
                    }
                    ;
                    break;
                case enums_1.KafkaAction.disconnect:
                    try {
                        delete this.connections[handleParams.payload.env].topics[handleParams.payload.topic].callbacks[handleParams.payload.id];
                        console.info(`connection stop ! payload ${JSON.stringify(handleParams.payload)}`);
                        console.log(`deel client id = ${handleParams.payload.id}`);
                        resolve({ status: true, action: handleParams.action });
                    }
                    catch (e) {
                        reject(e);
                    }
                    ;
                    break;
                case enums_1.KafkaAction.applyFilter:
                    console.log(`applying filter ${JSON.stringify(handleParams.payload)}`);
                    this.applyFilter(handleParams.payload);
                    resolve({ status: true, action: handleParams.action });
                    break;
                case enums_1.KafkaAction.describe:
                    const client = new kafka.Client(this.envierments[handleParams.payload.env]['zookeeperUrl'] + '/');
                    client.once('connect', function () {
                        client.loadMetadataForTopics([], function (error, results) {
                            if (error) {
                                return console.error(error);
                            }
                            resolve({ status: true, action: handleParams.action, results: results });
                        });
                    });
                    break;
                case enums_1.KafkaAction.fatchFromTimestamp:
                    let results = yield this.handle({ action: enums_1.KafkaAction.describe, payload: { env: handleParams.payload.env } });
                    let partitons = Object.keys(results.results[1].metadata[handleParams.payload.topic]);
                    let actionResults = yield this.getOffsetsInTimeStamp(handleParams.payload.env, handleParams.payload.topic, partitons, handleParams.payload.timestamp);
                    resolve({ status: true, action: handleParams.action, results: actionResults });
                    break;
            }
        }));
    }
    applyFilter({ env, topic, filter }) {
        this.connections[env].topics[topic].filter = filter;
    }
    topicMessageHandler(message, topic, env, done, context) {
        return __awaiter(this, void 0, void 0, function* () {
            //console.info(`Got message ` + JSON.stringify(message));
            context.handlePoolMessages([message], context.connections[env].topics[topic].instance, { topic, env });
            // handler code here
            return done();
        });
    }
    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
};
KafkaHandler = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject('global-config')),
    __param(1, di_1.Inject(loggerHandler_1.ILoggerHandler)),
    __param(2, di_1.Inject(dbHandler_1.IDbHandler))
], KafkaHandler);
exports.KafkaHandler = KafkaHandler;
process.on('uncaughtException', function (err) {
    if (err.errno === 'EADDRINUSE')
        console.log("error");
    else
        console.log(err);
});
process.on('SIGINT', () => process.exit());
//# sourceMappingURL=kafkaHandler.js.map