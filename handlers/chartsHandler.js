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
const di_1 = require("@decorators/di");
const enums_1 = require("../interfaces/enums");
const dbHandler_1 = require("./dbHandler");
let ChartsHandler = class ChartsHandler {
    constructor(dbHandler) {
        this.dbHandler = dbHandler;
    }
    handle(handleParams) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            switch (handleParams.action) {
                case enums_1.ChartActions.get:
                    try {
                        let res = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                            select cp.* from charts_properties cp
                            join charts_mapping cm on cm.cId = cp.id
                            where cm.uId = ${handleParams.payload.uId}` });
                        resolve({ action: enums_1.ChartActions.get, results: res.results, status: true });
                    }
                    catch (e) {
                        console.error(`error while geting users charts:`, e);
                        reject(e);
                    }
                    break;
                case enums_1.ChartActions.delete:
                    try {
                        yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                                delete from charts_mapping 
                                where cId = ${handleParams.payload.cId}` });
                        yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                    delete from charts_properties 
                    where id = ${handleParams.payload.cId}` });
                        return this.handle({ action: enums_1.ChartActions.get, payload: handleParams.payload.uId });
                    }
                    catch (e) {
                        console.error(`error while deleting user chart:`, e);
                        reject(e);
                    }
                case enums_1.ChartActions.update:
                    return this.handle({ action: enums_1.ChartActions.get, payload: handleParams.payload.uId });
            }
        }));
    }
};
ChartsHandler = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject(dbHandler_1.IDbHandler))
], ChartsHandler);
exports.ChartsHandler = ChartsHandler;
//# sourceMappingURL=chartsHandler.js.map