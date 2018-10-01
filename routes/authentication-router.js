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
const jwt = require("jsonwebtoken");
const user_1 = require("../dataModels/user");
const di_1 = require("@decorators/di");
const jwt_auth_middleware_1 = require("../middlewares/jwt-auth-middleware");
const dbHandler_1 = require("../handlers/dbHandler");
const loggerHandler_1 = require("../handlers/loggerHandler");
const passport = require('passport');
let AuthenticationRouter = class AuthenticationRouter {
    constructor(dbHandler, logger, jwtMiddleware, authConfig) {
        this.dbHandler = dbHandler;
        this.logger = logger;
        this.jwtMiddleware = jwtMiddleware;
        this.authConfig = authConfig;
        this.googleStrategy = require('passport-google-oauth2').Strategy;
        this.register = (app) => {
            app.use(passport.initialize());
            app.use(passport.session());
            passport.use(new this.googleStrategy(this.authConfig.googleConfig, (request, accessToken, refreshToken, profile, done) => __awaiter(this, void 0, void 0, function* () {
                let userId = yield user_1.User.getUserIdByEmail(profile.email, this.dbHandler);
                if (!userId) {
                    done(null, `UnAuthoraized`);
                    return;
                }
                const token = jwt.sign(userId, this.authConfig.SECRET_KEY);
                let user = yield user_1.User.buildUserObjectById(userId, this.dbHandler, profile);
                user.token = token;
                done(null, user);
            })));
            passport.serializeUser((user, cb) => {
                cb(null, user);
            });
            passport.deserializeUser((obj, cb) => {
                cb(null, obj);
            });
            this.initRouter(app, this.authConfig);
        };
        this.initRouter = (app, config) => {
            app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login',
                    'https://www.googleapis.com/auth/plus.profile.emails.read'] }));
            app.get('/auth/google/callback', passport.authenticate('google', {
                failureRedirect: config['loginRedirect'] + '/login'
            }), (req, res) => {
                if (req.user !== "UnAuthoraized") {
                    res.redirect(config['loginRedirect'] + "/?access_token=" + req.user.token);
                }
                else {
                    res.redirect(config['loginRedirect'] + "/login?UnAuthoraized");
                }
            });
            app.get('/auth/login', (req, res, next) => {
                if (req.query.return) {
                    req.session.oauth2return = req.query.return;
                }
                next();
            }, passport.authenticate('google', { scope: ['email', 'profile'] }));
            app.get('/profile', this.jwtMiddleware.authCall, (req, res) => __awaiter(this, void 0, void 0, function* () {
                let user = yield user_1.User.buildUserObjectById(req['__decoded_token'], this.dbHandler);
                res.send(user);
            }));
        };
    }
    extractProfile(profile, token) {
        let imageUrl = '';
        if (profile.photos && profile.photos.length) {
            imageUrl = profile.photos[0].value;
        }
        let userEntity = new user_1.User();
        userEntity.id = profile.id;
        userEntity.displayName = profile.displayName;
        userEntity.imageUrl = imageUrl;
        userEntity.token = token;
        return userEntity;
    }
};
AuthenticationRouter = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject(dbHandler_1.IDbHandler)),
    __param(1, di_1.Inject(loggerHandler_1.ILoggerHandler)),
    __param(2, di_1.Inject(jwt_auth_middleware_1.JWTAuthMiddleware)),
    __param(3, di_1.Inject('global-config'))
], AuthenticationRouter);
exports.AuthenticationRouter = AuthenticationRouter;
//# sourceMappingURL=authentication-router.js.map