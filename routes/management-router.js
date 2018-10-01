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
const dbHandler_1 = require("../handlers/dbHandler");
const enums_1 = require("../interfaces/enums");
const loggerHandler_1 = require("../handlers/loggerHandler");
const jwt_auth_middleware_1 = require("../middlewares/jwt-auth-middleware");
let ManagmentRouter = class ManagmentRouter {
    constructor(dbHandler, logger, jwtMiddleware, authConfig) {
        this.dbHandler = dbHandler;
        this.logger = logger;
        this.jwtMiddleware = jwtMiddleware;
        this.authConfig = authConfig;
        this.register = (app) => {
            app.get('/api/envierments/get', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.getEnvierments();
                    res.json(resutls);
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/envierments/save', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (req.body.id) {
                        let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                        UPDATE KafkaLooker.dim_envierments
                        SET envName = '${req.body.envName}',
                            props = '${JSON.stringify(req.body.props)}'
                        WHERE id = ${req.body.id}
                    ` });
                    }
                    else {
                        yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                        insert into KafkaLooker.dim_envierments (envName,props)
                        values('${req.body.envName}','${JSON.stringify(req.body.props)}');
                ` });
                    }
                    res.json(yield this.getEnvierments());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/envierments/delete', [this.jwtMiddleware.authCall], (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                    DELETE FROM  KafkaLooker.dim_envierments
                    WHERE id = ${req.body.id}
                ` });
                    res.json(yield this.getEnvierments());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            /* Manage Topics get/save/delete  */
            app.get('/api/topics/get', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.getTopics();
                    res.json(resutls);
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/topics/save', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (req.body.id) {
                        let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                        UPDATE KafkaLooker.dim_topics
                        SET 
                            envId = '${req.body.envId}',
                            topicName = '${req.body.topicName}'
                        WHERE id = ${req.body.id}
                    ` });
                    }
                    else {
                        yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                        insert into KafkaLooker.dim_topics (envId,topicName)
                        values('${req.body.envId}','${req.body.topicName}');
                ` });
                    }
                    res.json(yield this.getTopics());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/topics/delete', [this.jwtMiddleware.authCall], (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                    DELETE FROM  KafkaLooker.dim_topics
                    WHERE id = ${req.body.id}
                ` });
                    res.json(yield this.getTopics());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            /* Manage Topics get/save/delete  */
            app.get('/api/topics/get', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.getTopics();
                    res.json(resutls);
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/topics/save', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (req.body.id) {
                        let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                        UPDATE KafkaLooker.dim_topics
                        SET 
                            envId = '${req.body.envId}',
                            topicName = '${req.body.topicName}'
                        WHERE id = ${req.body.id}
                    ` });
                    }
                    else {
                        yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                        insert into KafkaLooker.dim_topics (envId,topicName)
                        values('${req.body.envId}','${req.body.topicName}');
                ` });
                    }
                    res.json(yield this.getTopics());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/topics/delete', [this.jwtMiddleware.authCall], (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                    DELETE FROM  KafkaLooker.dim_topics
                    WHERE id = ${req.body.id}
                ` });
                    res.json(yield this.getTopics());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            /* Manage users get/save/delete  */
            app.get('/api/user/get', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.getUsers();
                    res.json(resutls);
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/user/save', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (req.body.id) {
                        let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                                UPDATE KafkaLooker.users
                                SET 
                                    email = '${req.body.email}',
                                    isAdmin = ${req.body.isAdmin}
                                WHERE id = ${req.body.id}
                            ` });
                    }
                    else {
                        yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                                insert into KafkaLooker.users (email,isAdmin)
                                values('${req.body.email}',${req.body.isAdmin});
                        ` });
                    }
                    res.json(yield this.getUsers());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/user/delete', [this.jwtMiddleware.authCall], (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                    DELETE FROM  KafkaLooker.users
                    WHERE id = ${req.body.id}
                ` });
                    res.json(yield this.getUsers());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            /* Users Permissions  */
            app.get('/api/premission/get', [this.jwtMiddleware.authCall], (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.getPremissions();
                    res.json(resutls);
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/premission/save', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    if (req.body.id) {
                        let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                        UPDATE KafkaLooker.map_topics
                        SET 
                            userId = ${req.body.uId},
                            topicId = ${req.body.tId}
                        WHERE id = ${req.body.id}
                    ` });
                    }
                    else {
                        yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                        insert into KafkaLooker.map_topics (userId,topicId)
                        values(${req.body.uId},${req.body.tId});
                ` });
                    }
                    res.json(yield this.getPremissions());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
            app.post('/api/premission/delete', [this.jwtMiddleware.authCall], (req, res, next) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                    DELETE FROM  KafkaLooker.map_topics
                    WHERE id = ${req.body.id}
                ` });
                    res.json(yield this.getPremissions());
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
        };
        this.getEnvierments = () => __awaiter(this, void 0, void 0, function* () {
            let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
                SELECT id, envName, props
                FROM KafkaLooker.dim_envierments;
            ` });
            return resutls.results.map((x) => {
                return { id: x.id, envName: x.envName, props: JSON.parse(x.props) };
            });
        });
        this.getTopics = () => __awaiter(this, void 0, void 0, function* () {
            let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
        SELECT t.id, t.envId,e.envName, t.topicName
        FROM dim_topics t
            inner join dim_envierments  e on e.id = t.envId;
        ` });
            return resutls.results.map((x) => {
                return { id: x.id, envId: x.envId, envName: x.envName, topicName: x.topicName };
            });
        });
        this.getUsers = () => __awaiter(this, void 0, void 0, function* () {
            let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
            SELECT t.id, t.email, t.isAdmin
            FROM KafkaLooker.users t
        ` });
            return resutls.results.map((x) => {
                return { id: x.id, email: x.email, isAdmin: x.isAdmin };
            });
        });
        this.getPremissions = () => __awaiter(this, void 0, void 0, function* () {
            let resutls = yield this.dbHandler.handle({ action: enums_1.DBAction.executeSQL, payload: `
            select 
            mt.id,
            u.email,t.topicName,e.envName,
            e.id as eId,
            t.id as tId,
            u.id as uId 
            from KafkaLooker.map_topics mt
                LEFT join KafkaLooker.dim_topics t on t.id = mt.topicId
                LEFT join KafkaLooker.dim_envierments e on e.id  = t.envId
                LEFT join KafkaLooker.users u on u.id  = mt.userId
         ` });
            return resutls.results;
        });
    }
};
ManagmentRouter = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject(dbHandler_1.IDbHandler)),
    __param(1, di_1.Inject(loggerHandler_1.ILoggerHandler)),
    __param(2, di_1.Inject(jwt_auth_middleware_1.JWTAuthMiddleware)),
    __param(3, di_1.Inject('global-config'))
], ManagmentRouter);
exports.ManagmentRouter = ManagmentRouter;
//# sourceMappingURL=management-router.js.map