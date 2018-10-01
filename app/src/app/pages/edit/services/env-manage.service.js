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
const envierment_1 = require("../../../objects/envierment");
let EnvManagmentService = class EnvManagmentService {
    constructor(http) {
        this.http = http;
        this.get = () => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .get(environment_1.environment.endpoint + "api/envierments/get", { headers: headers })
                    .subscribe((response) => {
                    this.envierments = this.buildEnvsFromResponse(response);
                    resolve(this.envierments);
                });
            });
        };
        this.save = (envierment) => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .post(environment_1.environment.endpoint + "api/envierments/save", envierment, { headers: headers })
                    .subscribe(response => {
                    this.envierments = this.buildEnvsFromResponse(response);
                    resolve(this.envierments);
                });
            });
        };
        this.delete = (envierment) => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .post(environment_1.environment.endpoint + "api/envierments/delete", envierment, { headers: headers })
                    .subscribe(response => {
                    this.envierments = this.buildEnvsFromResponse(response);
                    resolve(this.envierments);
                });
            });
        };
        this.buildEnvsFromResponse = (response) => {
            return response.map(x => {
                let obj = new envierment_1.Envierment();
                obj.id = x.id;
                obj.envName = x.envName;
                obj.props = x.props;
                return obj;
            });
        };
    }
};
EnvManagmentService = __decorate([
    core_1.Injectable()
], EnvManagmentService);
exports.EnvManagmentService = EnvManagmentService;
//# sourceMappingURL=env-manage.service.js.map