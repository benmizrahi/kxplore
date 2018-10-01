"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("./server");
const di_1 = require("@decorators/di");
const config = require(process.env.CONFIG_PATH);
console.log(`config loaded from ${process.env.CONFIG_PATH}`);
config.loginRedirect = process.env.BASE_DOMAIN_URL;
config.googleConfig.callbackURL = process.env.BASE_DOMAIN_URL + "/auth/google/callback",
    di_1.Container.provide([
        { provide: 'global-config', useValue: config }
    ]);
di_1.Container.get(server_1.Server);
//# sourceMappingURL=startup.js.map