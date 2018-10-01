"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const consumer_object_1 = require("../objects/consumer-object");
let StreamConsumerService = class StreamConsumerService {
    constructor(socketKafkaService) {
        this.socketKafkaService = socketKafkaService;
        this.xAxisData = [];
        this.connections = {};
        this.activeTab = '';
        this.showJSON = null;
        this.stopConnection = (topic, env) => {
            if (this.connections[topic + "|" + env])
                this.connections[topic + "|" + env].stop();
        };
        this.isStreamExsits = (topic, env) => {
            if (this.connections[topic + "|" + env])
                return true;
            return false;
        };
        this.chartOptions = {
            legend: {
                data: [],
                align: 'left'
            },
            tooltip: {},
            xAxis: {
                data: this.xAxisData,
                silent: false,
                splitLine: {
                    show: false
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                }
            },
            series: [],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
                return idx * 5;
            }
        };
    }
    get connectionsList() {
        return this.connections;
    }
    startConnection(topic, env, executers, callback) {
        this.activeTab = topic + "|" + env;
        if (this.isStreamExsits(topic, env)) {
            return this.connections[topic + "|" + env];
        }
        else {
            this.connections[topic + "|" + env] = new consumer_object_1.ConsumerObject(this.socketKafkaService, topic, env, callback);
        }
        this.connections[topic + "|" + env].start();
        this.chartOptions.legend.data.push(topic + "|" + env);
        return this.connections[topic + "|" + env];
    }
};
StreamConsumerService = __decorate([
    core_1.Injectable()
], StreamConsumerService);
exports.StreamConsumerService = StreamConsumerService;
//# sourceMappingURL=stream-consumer.service.js.map