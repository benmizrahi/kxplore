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
const jwt = require("jsonwebtoken");
const di_1 = require("@decorators/di");
let JWTAuthMiddleware = class JWTAuthMiddleware {
    constructor(config) {
        this.config = config;
        this.authCall = (req, res, next) => {
            let bearerHeader = req.headers['authorization'];
            if (!bearerHeader) {
                console.log("token not supplied");
                res.json({ success: false, message: 'Authentication failed' });
            }
            else {
                let bearer = bearerHeader.split(" ");
                if (!(bearer.length == 2)) {
                    console.error(`token format is not valid header: ${bearerHeader}`);
                    res.json({ success: false, message: 'Authentication failed' });
                }
                else {
                    jwt.verify(bearer[1], this.config['SECRET_KEY'], (err, decoded) => {
                        if (err) {
                            console.error(`token is not valid ${bearer[1]}`);
                            res.json({ success: false, message: 'Authentication failed' });
                        }
                        else {
                            req['__decoded_token'] = decoded;
                            next();
                        }
                    });
                }
            }
        };
    }
};
JWTAuthMiddleware = __decorate([
    di_1.Injectable(),
    __param(0, di_1.Inject('global-config'))
], JWTAuthMiddleware);
exports.JWTAuthMiddleware = JWTAuthMiddleware;
//
//# sourceMappingURL=jwt-auth-middleware.js.map