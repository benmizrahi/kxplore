"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var server_1 = require("./server");
var di_1 = require("@decorators/di");
require('dotenv').config();
var config = require(process.env.CONFIG_PATH);
di_1.Container.provide([
    { provide: 'global-config', useValue: config }
]);
di_1.Container.get(server_1.Server);
//# sourceMappingURL=startup.js.map