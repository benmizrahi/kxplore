"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let AuthGuard = class AuthGuard {
    constructor(router, route, authenticationService) {
        this.router = router;
        this.route = route;
        this.authenticationService = authenticationService;
    }
    canActivate() {
        if (localStorage.getItem('currentUser')) {
            // logged in so return true
            return true;
        }
        if (location.search) {
            let token = location.search.replace("?", "").split("=")[1];
            if (token) {
                this.authenticationService.setLoginToken(token);
                this.router.navigate(['/']);
                return true;
            }
        }
        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
};
AuthGuard = __decorate([
    core_1.Injectable()
], AuthGuard);
exports.AuthGuard = AuthGuard;
//# sourceMappingURL=auth-guard.service.js.map