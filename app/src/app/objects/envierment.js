"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Envierment {
    constructor() {
        this.assign = (object) => {
            return Object.assign(new Envierment, object);
        };
        this.getEmptyInstance = () => {
            let empty = new Envierment();
            empty.envName = '';
            empty.props = {};
            return empty;
        };
    }
    validate() {
        if (!this.envName)
            return { status: false, error: 'envierment name must be defined' };
        if (!this.props || Object.keys(this.props).length == 0)
            return { status: false, error: 'properties must have at last one config value' };
        return { status: true };
    }
}
exports.Envierment = Envierment;
//# sourceMappingURL=envierment.js.map