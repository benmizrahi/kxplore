"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Topic {
    constructor() {
        this.assign = (object) => {
            return Object.assign(new Topic, object);
        };
        this.getEmptyInstance = () => {
            let empty = new Topic();
            empty.envId = -1;
            empty.topicName = '';
            return empty;
        };
    }
    validate() {
        if (!this.topicName)
            return { status: false, error: 'topic name must be defined' };
        if (!this.envId)
            return { status: false, error: 'please select envierment' };
        return { status: true };
    }
}
exports.Topic = Topic;
//# sourceMappingURL=topic.js.map