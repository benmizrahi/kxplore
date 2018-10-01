"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const premissions_1 = require("../../../objects/premissions");
const http_1 = require("@angular/common/http");
const environment_1 = require("../../../../environments/environment");
let PremissionManage = class PremissionManage {
    constructor(http) {
        this.http = http;
        this.get = () => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .get(environment_1.environment.endpoint + "api/premission/get", { headers: headers })
                    .subscribe((response) => {
                    resolve(this.buildPremissionFromResponed(response));
                });
            });
        };
        this.save = (user) => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .post(environment_1.environment.endpoint + "api/premission/save", user, { headers: headers })
                    .subscribe(response => {
                    resolve(this.buildPremissionFromResponed(response));
                });
            });
        };
        this.delete = (user) => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .post(environment_1.environment.endpoint + "api/premission/delete", user, { headers: headers })
                    .subscribe(response => {
                    resolve(this.buildPremissionFromResponed(response));
                });
            });
        };
        this.buildPremissionFromResponed = (response) => {
            return response.map(x => {
                let obj = new premissions_1.Premissions();
                obj.id = x.id;
                obj.tId = x.tId;
                obj.envName = x.envName;
                obj.topicName = x.topicName;
                obj.uId = x.uId;
                obj.eId = x.eId;
                obj.email = x.email;
                return obj;
            });
        };
    }
};
PremissionManage = __decorate([
    core_1.Injectable()
], PremissionManage);
exports.PremissionManage = PremissionManage;
//# sourceMappingURL=premissions-manage.service.js.map