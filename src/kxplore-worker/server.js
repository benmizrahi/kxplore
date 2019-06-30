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
var master_comunication_1 = require("./comunication/master-comunication");
var uuidv1 = require('uuid/v1');
var Server = /** @class */ (function () {
    function Server(config, masterCommunication) {
        this.config = config;
        var uuid = uuidv1();
        masterCommunication.start(uuid);
    }
    Server = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject('global-config')),
        __param(1, di_1.Inject(master_comunication_1.MasterCommunication)),
        __metadata("design:paramtypes", [Object, master_comunication_1.MasterCommunication])
    ], Server);
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map