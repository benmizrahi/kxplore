"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class User {
    constructor() {
        this.getEmptyInstance = () => {
            let empty = new User();
            empty.email = '';
            empty.isAdmin = false;
            return empty;
        };
    }
    validate() {
        if (!this.email)
            return { status: false, error: 'email must be defined' };
        return { status: true };
    }
}
exports.User = User;
//# sourceMappingURL=user.js.map