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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("@decorators/di");
var kxplore_workers_handler_1 = require("../handlers/kxplore-workers-handler");
var kxplore_master_handler_1 = require("../handlers/kxplore-master-handler");
var IDescibable_1 = require("../handlers/describers/IDescibable");
var uuidv1 = require('uuid/v1');
var JobExecuterRoute = /** @class */ (function () {
    function JobExecuterRoute(config, masterHandler, kxploreWorkersHandler) {
        var _this = this;
        this.config = config;
        this.masterHandler = masterHandler;
        this.kxploreWorkersHandler = kxploreWorkersHandler;
        this.register = function (app, io) {
            app.post('/api/describe', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var payload, results, response, ex_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            payload = req.body;
                            return [4 /*yield*/, this.masterHandler.describe(payload.env, IDescibable_1.matchPatten(payload.env))];
                        case 1:
                            results = _a.sent();
                            response = { status: true, message: 'OK', results: results };
                            res.status(200).send(response);
                            return [3 /*break*/, 3];
                        case 2:
                            ex_1 = _a.sent();
                            res.status(500).send({ status: false, message: "ERROR - " + ex_1 });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            app.post('/api/job/new', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
                var payload, uuid, response, ex_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            payload = req.body;
                            uuid = uuidv1();
                            return [4 /*yield*/, this.masterHandler.start({ env: payload.env, payload: payload.params, uuid: uuid })];
                        case 1:
                            _a.sent();
                            response = { status: true, message: 'OK', uuid: uuid };
                            res.status(200).send(response);
                            return [3 /*break*/, 3];
                        case 2:
                            ex_2 = _a.sent();
                            res.status(500).send({ status: false, message: "ERROR - " + ex_2 });
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); });
            io.of('/subscribe')
                .on('connection', function (socket) {
                var jobId = socket.request._query['jobId'];
                _this.kxploreWorkersHandler.subscribe(jobId).on('NEW_DATA', function (data) {
                    socket.emit("MESSAGES_" + jobId, data);
                });
                socket.on('disconnect', function () {
                    //this.workersHandler.disconnect(socket.handshake.query.param.uuid);
                });
            });
        };
    }
    JobExecuterRoute = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject('global-config')),
        __param(1, di_1.Inject(kxplore_master_handler_1.KxploreMasterHandler)),
        __param(2, di_1.Inject(kxplore_workers_handler_1.KxploreWorkersHandler)),
        __metadata("design:paramtypes", [Object, kxplore_master_handler_1.KxploreMasterHandler,
            kxplore_workers_handler_1.KxploreWorkersHandler])
    ], JobExecuterRoute);
    return JobExecuterRoute;
}());
exports.JobExecuterRoute = JobExecuterRoute;
//# sourceMappingURL=job-executer.route.js.map