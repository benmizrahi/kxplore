"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
var di_1 = require("@decorators/di");
var KxploreWorkersHandler = /** @class */ (function () {
    function KxploreWorkersHandler(config) {
        var _this = this;
        this.config = config;
        this.activeWorkers = {};
        this.connect = function (uuid, socket) {
            console.log("Worker registered : " + uuid + " ");
            _this.activeWorkers[uuid] = { socket: socket, count: 0 };
            socket.on('TASK_CANCELED', function (t) {
                _this.activeWorkers[uuid].count--;
                _this.subscribers[t.job_id].next(t);
            });
            socket.on('TASK_FINISHED', function (t) {
                _this.activeWorkers[uuid].count--;
                _this.subscribers[t.job_id].next(t);
            });
        };
        this.disconnect = function (uuid) {
            //delete worker form list
            delete _this.activeWorkers[uuid];
            //delete worker from all active jobs
            console.log("Worker disconnected : " + uuid + " ");
        };
        this.transfer = function (t, observer) {
            var max = parseInt(_this.config['max-tasks-per-worker']);
            var w = _this.selectNextWorker(max);
            if (w) {
                t.processing = true;
                t.worker = w;
                _this.activeWorkers[w].socket.emit('PROCESS_TASK', t);
                _this.activeWorkers[w].count++;
                console.log("processing task on worker " + w + "! ");
                return t;
            }
            else {
                setTimeout(function () { return _this.transfer(t, observer); }, parseInt(_this.config['worker-check-frquency-sec']) * 1000);
            }
        };
        this.cancel = function (t) {
            if (t.worker) {
                _this.activeWorkers[t.worker].socket.emit('CANCEL_TASK', t);
            }
        };
        this.selectNextWorker = function (max) {
            var selectedWorker, tasksCount = null;
            for (var worker in _this.activeWorkers) {
                if (_this.activeWorkers[worker].count == max) {
                    continue;
                }
                if (tasksCount == null || _this.activeWorkers[worker].count < tasksCount) {
                    selectedWorker = worker;
                    tasksCount = _this.activeWorkers[worker].count;
                }
            }
            return selectedWorker;
        };
    }
    KxploreWorkersHandler = __decorate([
        di_1.Injectable(),
        __param(0, di_1.Inject('global-config')),
        __metadata("design:paramtypes", [Object])
    ], KxploreWorkersHandler);
    return KxploreWorkersHandler;
}());
exports.KxploreWorkersHandler = KxploreWorkersHandler;
//# sourceMappingURL=kxplore-workers-handler.js.map