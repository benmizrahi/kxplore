"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("@decorators/di");
var events_1 = require("events");
var KxploreWorkersHandler = /** @class */ (function () {
    function KxploreWorkersHandler() {
        var _this = this;
        this.activeJobs = {};
        this.activeWorkers = {};
        this.connect = function (uuid, socket) {
            _this.activeWorkers[uuid] = { socket: socket, activeJobs: [] };
            var publish = {};
            Object.keys(_this.activeWorkers).filter(function (x) { return x != uuid; }).
                map(function (worker) {
                if (_this.activeWorkers[worker].activeJobs.length > 0) {
                    _this.activeWorkers[worker].activeJobs.map(function (job) {
                        if (!publish[job.uuid]) {
                            publish[job.uuid] = job;
                        }
                    });
                }
            });
            if (Object.keys(publish).length > 0) {
                Object.keys(publish).map(function (jobToPublish) {
                    _this.activeWorkers[uuid].socket.emit('NEW_JOB', publish[jobToPublish]);
                    _this.activeWorkers[uuid].activeJobs.push(publish[jobToPublish]);
                });
            }
        };
        this.subscribe = function (uuid) {
            return _this.activeJobs[uuid];
        };
        this.disconnect = function (uuid) {
            if (_this.activeWorkers[uuid]) {
                delete _this.activeWorkers[uuid]; //delete the worker!
            }
        };
        this.publishJob = function (jobInfo) {
            _this.activeJobs[jobInfo.uuid] = new events_1.EventEmitter();
            Object.keys(_this.activeWorkers).map(function (worker) {
                _this.activeWorkers[worker].socket.emit('NEW_JOB', jobInfo);
                _this.activeWorkers[worker].activeJobs.push(jobInfo); //push the job executing in each worker!           
                _this.activeWorkers[worker].socket.on("JOB_DATA_" + jobInfo.uuid, function (data) {
                    //on data from worker!
                    _this.activeJobs[jobInfo.uuid].emit('NEW_DATA', data);
                });
            });
        };
        this.stopJob = function (jobInfo) {
            Object.keys(_this.activeWorkers).map(function (worker) {
                var index = _this.activeWorkers[worker].activeJobs.indexOf(jobInfo);
                if (index > -1) {
                    _this.activeWorkers[worker].socket.emit('DELETE', jobInfo); //tell the worker to stop!
                    _this.activeWorkers[worker].activeJobs.splice(index, 1); //removes the job from active jobs!
                }
            });
            _this.activeJobs[jobInfo.uuid].removeAllListeners();
            delete _this.activeJobs[jobInfo.uuid];
        };
    }
    KxploreWorkersHandler = __decorate([
        di_1.Injectable()
    ], KxploreWorkersHandler);
    return KxploreWorkersHandler;
}());
exports.KxploreWorkersHandler = KxploreWorkersHandler;
//# sourceMappingURL=kxplore-workers-handler.js.map