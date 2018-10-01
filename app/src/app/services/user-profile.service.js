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
const environment_1 = require("../../environments/environment");
let UserProfileService = class UserProfileService {
    constructor(http, authenticationService) {
        this.http = http;
        this.authenticationService = authenticationService;
        this.getUserProfile = () => {
            if (this.authenticationService.isLogedIn()) {
                return this.loadUser();
            }
            if (location.search) {
                let token = location.search.replace("?", "").split("=")[1];
                if (token) {
                    localStorage.setItem("currentUser", token);
                    return this.loadUser(token);
                }
            }
        };
        this.isAdmin = () => {
            if (this.userProfile && this.userProfile.admin == "1")
                return true;
            return false;
        };
        this.loadUser = (token) => {
            return new Promise((resolve, reject) => {
                const headers = new http_1.HttpHeaders({ 'authorization': "token " + localStorage.getItem("currentUser") });
                this.http
                    .get(environment_1.environment.endpoint + "profile", { headers: headers })
                    .subscribe(response => {
                    this.userProfile = response;
                    resolve(true);
                });
            });
        };
    }
};
UserProfileService = __decorate([
    core_1.Injectable()
], UserProfileService);
exports.UserProfileService = UserProfileService;
//# sourceMappingURL=user-profile.service.js.map