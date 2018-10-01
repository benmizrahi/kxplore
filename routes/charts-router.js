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
const jwt_auth_middleware_1 = require("../middlewares/jwt-auth-middleware");
const chartsHandler_1 = require("../handlers/chartsHandler");
const enums_1 = require("../interfaces/enums");
let ChartsRouter = class ChartsRouter {
    constructor(jwtMiddleware, chartsHandler, authConfig) {
        this.jwtMiddleware = jwtMiddleware;
        this.chartsHandler = chartsHandler;
        this.authConfig = authConfig;
        this.register = (app) => {
            app.get('/api/charts/get', [this.jwtMiddleware.authCall], (req, res) => __awaiter(this, void 0, void 0, function* () {
                try {
                    let resutls = yield this.chartsHandler.handle({ action: enums_1.ChartActions.get, payload: {
                            uId: req['__decoded_token']
                        } });
                    res.json(resutls.results);
                }
                catch (e) {
                    console.error(JSON.stringify(e));
                    throw new Error(e);
                }
            }));
        };
    }
};
ChartsRouter = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject(jwt_auth_middleware_1.JWTAuthMiddleware)),
    __param(1, di_1.Inject(chartsHandler_1.ChartsHandler)),
    __param(2, di_1.Inject('global-config'))
], ChartsRouter);
exports.ChartsRouter = ChartsRouter;
//# sourceMappingURL=charts-router.js.map