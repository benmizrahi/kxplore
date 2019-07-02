"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("@decorators/di");
var kxplore_workers_handler_1 = require("./kxplore-workers-handler");
var KxploreMasterHandler = /** @class */ (function () {
    function KxploreMasterHandler(config, workersHandler) {
        var _this = this;
        this.config = config;
        this.workersHandler = workersHandler;
        this.describe = function (env, describer) {
            return describer.describe(env);
        };
        this.start = function (payload) {
            return new Promise(function (resolve, reject) {
                try {
                    _this.workersHandler.publishJob(payload);
                    resolve({ status: true });
                }
                catch (ex) {
                    reject("unable to get publish new job! " + payload + ", error: " + ex);
                }
            });
        };
        this.stop = function (payload) {
            return new Promise(function (resolve, reject) {
                try {
                    _this.workersHandler.stopJob(payload.uuid);
                    resolve({ status: true });
                }
                catch (ex) {
                    reject("unable to get publish new job! " + payload + ", error: " + ex);
                }
            });
        };
    }
    KxploreMasterHandler = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject('global-config')),
        __param(1, di_1.Inject(kxplore_workers_handler_1.KxploreWorkersHandler)),
        __metadata("design:paramtypes", [Object, kxplore_workers_handler_1.KxploreWorkersHandler])
    ], KxploreMasterHandler);
    return KxploreMasterHandler;
}());
exports.KxploreMasterHandler = KxploreMasterHandler;
//# sourceMappingURL=kxplore-master-handler.js.map