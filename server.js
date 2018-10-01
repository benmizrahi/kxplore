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
const express = require("express");
const cors = require("cors");
const path = require("path");
const di_1 = require("@decorators/di");
const jwt_auth_middleware_1 = require("./middlewares/jwt-auth-middleware");
const authentication_router_1 = require("./routes/authentication-router");
const stream_router_1 = require("./routes/stream-router");
const management_router_1 = require("./routes/management-router");
const charts_router_1 = require("./routes/charts-router");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const http = require('http');
let Server = class Server {
    constructor(config, jwtAuthMiddleware, authenticationRouter, managmentRouter, streamRouter, chartsRouter) {
        this.config = config;
        const app = this.initApp();
        const server = this.initServer(app);
        authenticationRouter.register(app);
        managmentRouter.register(app);
        chartsRouter.register(app);
        streamRouter.register(server);
        app.use(express.static(path.join(__dirname, 'dist')));
        const allowedExt = [
            '.js',
            '.ico',
            '.css',
            '.png',
            '.jpg',
            '.woff2',
            '.woff',
            '.ttf',
            '.svg',
        ];
        app.get('*', (req, res) => {
            if (allowedExt.filter(ext => req.url.indexOf(ext) > 0).length > 0) {
                res.sendFile(path.resolve(`dist/${req.url}`));
            }
            else {
                res.sendFile(path.resolve('dist/index.html'));
            }
        });
    }
    initApp() {
        const app = express();
        app.use(cors({ credentials: true, origin: 'http://localhost:4200' }));
        app.use(cookieParser());
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: true
        }));
        return app;
    }
    initServer(app) {
        const server = http.createServer(app);
        server.listen(3000, () => {
            console.log(`start listen at port 3000`);
        });
        return server;
    }
};
Server = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject('global-config')),
    __param(1, di_1.Inject(jwt_auth_middleware_1.JWTAuthMiddleware)),
    __param(2, di_1.Inject(authentication_router_1.AuthenticationRouter)),
    __param(3, di_1.Inject(management_router_1.ManagmentRouter)),
    __param(4, di_1.Inject(stream_router_1.StreamRouter)),
    __param(5, di_1.Inject(charts_router_1.ChartsRouter))
], Server);
exports.Server = Server;
//# sourceMappingURL=server.js.map