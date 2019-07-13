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
            console.log("Worker registered : " + uuid + " ");
            _this.activeWorkers[uuid] = socket;
            Object.keys(_this.activeJobs).map(function (job_id) {
                _this.publish_job_to_worker(_this.activeJobs[job_id].job, socket, _this.activeJobs[job_id].event);
                _this.activeJobs[job_id].activeWorkers.push(uuid);
            });
        };
        this.subscribe = function (uuid) {
            if (_this.activeJobs[uuid])
                return _this.activeJobs[uuid].event;
            else {
                return null;
            }
        };
        this.disconnect = function (uuid) {
            //delete worker form list
            delete _this.activeWorkers[uuid];
            //delete worker from all active jobs
            Object.keys(_this.activeJobs).map(function (job_id) {
                var index = _this.activeJobs[job_id].activeWorkers.indexOf(uuid);
                if (index > -1)
                    _this.activeJobs[job_id].activeWorkers = _this.activeJobs[job_id].activeWorkers.splice(index, 1);
            });
            console.log("Worker disconnected : " + uuid + " ");
        };
        this.publishJob = function (jobInfo) {
            _this.activeJobs[jobInfo.job_uuid] = { event: new events_1.EventEmitter(), job: jobInfo, activeWorkers: [] };
            Object.keys(_this.activeWorkers).map(function (worker) {
                _this.publish_job_to_worker(jobInfo, _this.activeWorkers[worker], _this.activeJobs[jobInfo.job_uuid].event);
                _this.activeJobs[jobInfo.job_uuid].activeWorkers.push(worker);
            });
        };
        this.stopJob = function (uuid) {
            Object.keys(_this.activeWorkers).map(function (worker) {
                _this.activeWorkers[worker].emit("DELETE_" + uuid); //tell the worker to stop!
            });
            if (_this.activeJobs[uuid]) {
                _this.activeJobs[uuid].event.removeAllListeners();
                delete _this.activeJobs[uuid];
            }
        };
        this.publish_job_to_worker = function (jobInfo, worker_socket, job_emmiter) {
            worker_socket.emit('NEW_JOB', jobInfo);
            worker_socket.on("JOB_DATA_" + jobInfo.job_uuid, function (data) {
                //on data from worker!
                if (_this.activeJobs[jobInfo.job_uuid]) {
                    job_emmiter.emit("MESSAGES_" + jobInfo.job_uuid, data);
                }
            });
        };
    }
    KxploreWorkersHandler = __decorate([
        di_1.Injectable()
    ], KxploreWorkersHandler);
    return KxploreWorkersHandler;
}());
exports.KxploreWorkersHandler = KxploreWorkersHandler;
//# sourceMappingURL=kxplore-workers-handler.js.map