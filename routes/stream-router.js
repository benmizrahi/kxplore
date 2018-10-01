'use strict';
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
const socket = require("socket.io");
const jwt = require("jsonwebtoken");
const di_1 = require("@decorators/di");
const loggerHandler_1 = require("../handlers/loggerHandler");
const enums_1 = require("../interfaces/enums");
const kafkaHandler_1 = require("../handlers/kafkaHandler");
let StreamRouter = class StreamRouter {
    constructor(config, logger, kafkaHandler) {
        this.config = config;
        this.logger = logger;
        this.kafkaHandler = kafkaHandler;
        this.register = (server) => {
            const redisAdapter = require('socket.io-redis');
            const io = socket(server);
            io.adapter(redisAdapter({ host: this.config['redis-config']['host'], port: this.config['redis-config']['port'] }));
            io.use((socket, next) => {
                if (socket.handshake.query && socket.handshake.query.token) {
                    jwt.verify(socket.handshake.query.token, this.config['SECRET_KEY'], function (err, decoded) {
                        if (err)
                            return next(new Error('Authentication error'));
                        socket.decoded = decoded;
                        next();
                    });
                }
                else {
                    next(new Error('Authentication error'));
                }
            });
            this.socketIntHanlder(this.config, io);
        };
        this.socketIntHanlder = (config, io) => {
            io.on('connection', (client) => {
                const connections = new Map();
                client.on('start-consumer', (data) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        let handler = yield this.kafkaHandler.handle({ action: enums_1.KafkaAction.connect, payload: {
                                env: data.env,
                                topic: data.topic,
                                dataCallback: this.publishdata(client, data, io)
                            } });
                        let current = data;
                        current['id'] = handler.results;
                        var clientValues = connections.get(client);
                        if (clientValues) {
                            clientValues.push(current);
                        }
                        else {
                            clientValues = [];
                            clientValues.push(current);
                        }
                        connections.set(client, clientValues);
                        console.log(`createdclient id = ${handler.results}`);
                        client.emit(`akk-consumer-id-${data.topic}-${data.env}`, { id: handler.results });
                    }
                    catch (e) {
                    }
                }));
                client.on('stop-consumer', (data) => __awaiter(this, void 0, void 0, function* () {
                    let res = yield this.kafkaHandler.handle({ action: enums_1.KafkaAction.disconnect, payload: {
                            env: data.env,
                            topic: data.topic,
                            id: data.id
                        } });
                    let clientValues = connections.get(client);
                    connections.set(client, clientValues.filter(x => {
                        return x.id != data.id;
                    }));
                }));
                client.on('disconnect', () => __awaiter(this, void 0, void 0, function* () {
                    let clientValues = connections.get(client);
                    if (!clientValues)
                        return;
                    clientValues.forEach((clientConnections) => __awaiter(this, void 0, void 0, function* () {
                        let res = yield this.kafkaHandler.handle({ action: enums_1.KafkaAction.disconnect, payload: {
                                env: clientConnections.env,
                                topic: clientConnections.topic,
                                id: clientConnections.id
                            } });
                        console.log(`deconnected from" ${clientConnections.topic}-${clientConnections.env}`);
                    }));
                    connections.delete(client); //delete the client
                }));
                client.on('discribe-env', (data) => __awaiter(this, void 0, void 0, function* () {
                    let res = yield this.kafkaHandler.handle({ action: enums_1.KafkaAction.describe, payload: {
                            env: data.env
                        } });
                    client.emit(`discribe-env-results`, res);
                }));
                client.on('start-consumer-by-timestamp', (data) => __awaiter(this, void 0, void 0, function* () {
                    let res = yield this.kafkaHandler.handle({ action: enums_1.KafkaAction.fatchFromTimestamp, payload: {
                            env: data.env,
                            topic: data.topic
                        } });
                    client.emit(`start-consumer-by-timestamp-results`, res);
                }));
            });
        };
        this.publishdata = (client, data, io) => {
            return (message) => {
                io.emit(`messages-list-${data.topic}-${data.env}`, { topic: data.topic, env: data.env, messages: message });
            };
        };
    }
};
StreamRouter = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject('global-config')),
    __param(1, di_1.Inject(loggerHandler_1.ILoggerHandler)),
    __param(2, di_1.Inject(kafkaHandler_1.KafkaHandler))
], StreamRouter);
exports.StreamRouter = StreamRouter;
//# sourceMappingURL=stream-router.js.map