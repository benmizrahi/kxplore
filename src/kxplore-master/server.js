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
var express = require("express");
var job_executer_route_1 = require("./routes/job-executer.route");
var http = require("http");
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var cors = require("cors");
var workers_api_route_1 = require("./routes/workers-api.route");
var Server = /** @class */ (function () {
    function Server(config, jobExecuterRoute, workersSocketRoute) {
        this.config = config;
        var app = express();
        var server = this.initServer(app);
        app.use(cors({ credentials: true, origin: '*' }));
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        var io = require('socket.io')(server, {
            upgradeTimeout: 30000,
            transports: ['websocket'],
            allowUpgrades: false,
            pingTimeout: 30000,
        });
        jobExecuterRoute.register(app, io);
        workersSocketRoute.register(io);
    }
    Server.prototype.initServer = function (app) {
        var server = http.createServer(app);
        server.listen(3001, function () {
            console.log("start listen at port 3001");
        });
        return server;
    };
    Server = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject('global-config')),
        __param(1, di_1.Inject(job_executer_route_1.JobExecuterRoute)),
        __param(2, di_1.Inject(workers_api_route_1.WorkersSocketRoute)),
        __metadata("design:paramtypes", [Object, job_executer_route_1.JobExecuterRoute,
            workers_api_route_1.WorkersSocketRoute])
    ], Server);
    return Server;
}());
exports.Server = Server;
//# sourceMappingURL=server.js.map