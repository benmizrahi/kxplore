"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var WorkerMessages;
(function (WorkerMessages) {
    WorkerMessages["POST_MESSAGES"] = "post";
    WorkerMessages["CONSUMER_STOP"] = "stop";
    WorkerMessages["FILTER_CHANGED"] = "update";
    WorkerMessages["INIT_WORKER_JOB"] = "init";
    WorkerMessages["WORKER_LOG"] = "log";
})(WorkerMessages = exports.WorkerMessages || (exports.WorkerMessages = {}));
var DBAction;
(function (DBAction) {
    DBAction[DBAction["executeSQL"] = 0] = "executeSQL";
})(DBAction = exports.DBAction || (exports.DBAction = {}));
var LoggerAction;
(function (LoggerAction) {
    LoggerAction[LoggerAction["info"] = 0] = "info";
    LoggerAction[LoggerAction["error"] = 1] = "error";
    LoggerAction[LoggerAction["debug"] = 2] = "debug";
})(LoggerAction = exports.LoggerAction || (exports.LoggerAction = {}));
var KafkaAction;
(function (KafkaAction) {
    KafkaAction[KafkaAction["connect"] = 0] = "connect";
    KafkaAction[KafkaAction["disconnect"] = 1] = "disconnect";
    KafkaAction[KafkaAction["applyFilter"] = 2] = "applyFilter";
    KafkaAction[KafkaAction["describe"] = 3] = "describe";
    KafkaAction[KafkaAction["fatchFromTimestamp"] = 4] = "fatchFromTimestamp";
})(KafkaAction = exports.KafkaAction || (exports.KafkaAction = {}));
var DBTables;
(function (DBTables) {
    DBTables["USERS"] = "users_table";
    DBTables["TOPICS"] = "users_topics";
    DBTables["ENV"] = "users_env";
})(DBTables = exports.DBTables || (exports.DBTables = {}));
var QueueActions;
(function (QueueActions) {
    QueueActions[QueueActions["push"] = 0] = "push";
    QueueActions[QueueActions["clean"] = 1] = "clean";
    QueueActions[QueueActions["pop"] = 2] = "pop";
})(QueueActions = exports.QueueActions || (exports.QueueActions = {}));
var ChartActions;
(function (ChartActions) {
    ChartActions[ChartActions["get"] = 0] = "get";
    ChartActions[ChartActions["update"] = 1] = "update";
    ChartActions[ChartActions["delete"] = 2] = "delete";
})(ChartActions = exports.ChartActions || (exports.ChartActions = {}));
//# sourceMappingURL=enums.js.map