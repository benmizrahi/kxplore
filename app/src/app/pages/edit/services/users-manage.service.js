"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const environment_1 = require("../../../../environments/environment");
const http_1 = require("@angular/common/http");
const user_1 = require("../../../objects/user");
let UsersManageService = class UsersManageService {
    constructor(http) {
        this.http = http;
        this.get = () => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .get(environment_1.environment.endpoint + "api/user/get", { headers: headers })
                    .subscribe((response) => {
                    resolve(this.buildUsersFromResponse(response));
                });
            });
        };
        this.save = (user) => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .post(environment_1.environment.endpoint + "api/user/save", user, { headers: headers })
                    .subscribe(response => {
                    resolve(this.buildUsersFromResponse(response));
                });
            });
        };
        this.delete = (user) => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .post(environment_1.environment.endpoint + "api/user/delete", user, { headers: headers })
                    .subscribe(response => {
                    resolve(this.buildUsersFromResponse(response));
                });
            });
        };
        this.buildUsersFromResponse = (response) => {
            return response.map(x => {
                let obj = new user_1.User();
                obj.email = x.email;
                obj.id = x.id;
                obj.isAdmin = x.isAdmin;
                return obj;
            });
        };
    }
};
UsersManageService = __decorate([
    core_1.Injectable()
], UsersManageService);
exports.UsersManageService = UsersManageService;
//# sourceMappingURL=users-manage.service.js.map