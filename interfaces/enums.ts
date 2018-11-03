export enum WorkerMessages {
    POST_MESSAGES = "post",
    CONSUMER_STOP = "stop",
    FILTER_CHANGED = "update",
    INIT_WORKER_JOB = "init",
    WORKER_LOG = "log"
}

export enum DBAction {
    executeSQL
}
export enum LoggerAction {
    info,
    error,
    debug
}
export enum KafkaAction {
    connect,
    resume,
    pause,
    clear,
    applyFilter,
    describe,
    fatchFromTimestamp,
    setOffsets,
    reloadEnvierment
}

export enum DBTables {
    USERS = "users_table",
    TOPICS = "users_topics",
    ENV = "users_env"
}

export enum QueueActions {
    push,
    clean,
    pop
}

export enum ChartActions {
    get,
    update,
    delete
}