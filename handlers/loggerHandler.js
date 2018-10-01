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
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../interfaces/enums");
const di_1 = require("@decorators/di");
const moment = require("moment");
let ILoggerHandler = class ILoggerHandler {
    constructor(config) {
        this.config = config;
        this.original = {
            debug: console.debug,
            error: console.error,
            info: console.info
        };
        console.debug = (message) => {
            this.handle({ action: enums_1.LoggerAction.debug, payload: message });
        };
        console.error = (message) => {
            this.handle({ action: enums_1.LoggerAction.error, payload: message });
        };
        console.info = console.log = (message) => {
            this.handle({ action: enums_1.LoggerAction.info, payload: message });
        };
    }
    handle(handleParams) {
        let datetime = moment();
        switch (handleParams.action) {
            case enums_1.LoggerAction.error:
                this.original.error(`${datetime} ERROR: ${handleParams.payload}`);
                break;
            case enums_1.LoggerAction.info:
                this.original.info(`${datetime} INFO: ${handleParams.payload}`);
                break;
            case enums_1.LoggerAction.debug:
                this.original.error(`${datetime} DEBUG: ${handleParams.payload}`);
                break;
        }
        return { action: handleParams.action, results: "OK", status: true };
    }
};
ILoggerHandler = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject('global-config'))
], ILoggerHandler);
exports.ILoggerHandler = ILoggerHandler;
//# sourceMappingURL=loggerHandler.js.map