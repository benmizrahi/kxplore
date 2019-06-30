"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var events_1 = require("events");
var AbstractConsumer = /** @class */ (function () {
    function AbstractConsumer() {
        this.activeJobs = {};
    }
    AbstractConsumer.prototype.start = function (jobInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                var job = { emiter: new events_1.EventEmitter(), privateComp: null };
                _this.init(jobInfo, job);
                _this.activeJobs[jobInfo.uuid] = job;
                resolve(job.emiter);
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    AbstractConsumer.prototype.stop = function (jobInfo) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            try {
                _this.dispose(_this.activeJobs[jobInfo.uuid]);
                delete _this.activeJobs[jobInfo.uuid];
                resolve(true);
            }
            catch (ex) {
                reject(ex);
            }
        });
    };
    return AbstractConsumer;
}());
exports.AbstractConsumer = AbstractConsumer;
//# sourceMappingURL=abstract-consumer.hanler.js.map