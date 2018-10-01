"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const http_1 = require("@angular/common/http");
const environment_1 = require("../../../../environments/environment");
const topic_1 = require("../../../objects/topic");
let TopicManageService = class TopicManageService {
    constructor(http, manageEnv) {
        this.http = http;
        this.manageEnv = manageEnv;
        this.get = () => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .get(environment_1.environment.endpoint + "api/topics/get", { headers: headers })
                    .subscribe((response) => {
                    resolve(this.buildTopicFromResponse(response));
                });
            });
        };
        this.save = (envierment) => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .post(environment_1.environment.endpoint + "api/topics/save", envierment, { headers: headers })
                    .subscribe(response => {
                    resolve(this.buildTopicFromResponse(response));
                });
            });
        };
        this.delete = (envierment) => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .post(environment_1.environment.endpoint + "api/topics/delete", envierment, { headers: headers })
                    .subscribe(response => {
                    resolve(this.buildTopicFromResponse(response));
                });
            });
        };
        this.buildTopicFromResponse = (response) => {
            return response.map(x => {
                let obj = new topic_1.Topic();
                obj.id = x.id;
                obj.envId = x.envId;
                obj.envName = x.envName;
                obj.topicName = x.topicName;
                return obj;
            });
        };
    }
};
TopicManageService = __decorate([
    core_1.Injectable()
], TopicManageService);
exports.TopicManageService = TopicManageService;
//# sourceMappingURL=topic-manage.service.js.map