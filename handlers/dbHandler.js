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
const mysql = require("mysql");
const enums_1 = require("../interfaces/enums");
const di_1 = require("@decorators/di");
const loggerHandler_1 = require("./loggerHandler");
class DBActionResults {
}
exports.DBActionResults = DBActionResults;
let IDbHandler = class IDbHandler {
    //connection to mysql
    constructor(logger, config) {
        this.logger = logger;
        this.config = config;
        this.execute = (query) => {
            console.info(`Executing Query ${query}`);
            return new Promise((resolve, reject) => {
                this.connection.query(query, (err, results) => {
                    if (err) {
                        console.error(`Query Error:\n ${err}`);
                        reject(err);
                    }
                    console.info(`Query Finished Sucssesfully`);
                    resolve(results);
                });
            });
        };
        this.logger = logger;
        this.config = config;
        this.connection = mysql.createConnection({
            host: config.mysql.host,
            user: config.mysql.user,
            password: config.mysql.password,
            database: config.mysql.database
        });
        this.connection.connect();
        logger.handle({ action: enums_1.LoggerAction.info, payload: "MySql Loaded!" });
    }
    //public function to execute opertion vs db
    handle(handleParams) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dbResults = yield this.execute(handleParams.payload);
                return {
                    status: true,
                    action: handleParams.action,
                    results: dbResults
                };
            }
            catch (ex) {
                this.logger.handle({ action: enums_1.LoggerAction.error, payload: `db throws an error ${ex}` });
                return {
                    status: false,
                    action: handleParams.action,
                    results: ex
                };
            }
        });
    }
};
IDbHandler = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject(loggerHandler_1.ILoggerHandler)),
    __param(1, di_1.Inject('global-config'))
], IDbHandler);
exports.IDbHandler = IDbHandler;
//# sourceMappingURL=dbHandler.js.map