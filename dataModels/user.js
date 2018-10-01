"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../interfaces/enums");
class User {
}
User.getUserIdByEmail = (email, dbHanlder) => __awaiter(this, void 0, void 0, function* () {
    let res = yield dbHanlder.handle({ action: enums_1.DBAction.executeSQL, payload: `SELECT id from users where email = '${email}'` });
    return res.results.length > 0 ? res.results[0].id : null;
});
User.buildUserObjectById = (id, dbHanlder, profile) => __awaiter(this, void 0, void 0, function* () {
    if (profile) {
        let imageUrl = '';
        if (profile.photos && profile.photos.length) {
            imageUrl = profile.photos[0].value;
        }
        let update_profile = yield dbHanlder.handle({ action: enums_1.DBAction.executeSQL, payload: `INSERT INTO users_profile (authId,displayName,image,userId)
            VALUES("${profile.id}", "${profile.displayName}", "${imageUrl}",${id}) ON DUPLICATE KEY UPDATE    
                    authId="${profile.id}", displayName="${profile.displayName}",image = "${imageUrl}"` });
        console.log(`profile update status: ${update_profile.status}`);
    }
    let profile_res = yield dbHanlder.handle({ action: enums_1.DBAction.executeSQL, payload: `SELECT u.id,u.isAdmin,u.email,up.displayName,up.image,e.envName,t.topicName
                from users u
                JOIN users_profile up on u.id = up.userId
                JOIN map_topics mt on mt.userId = up.userId
                JOIN dim_topics t on t.id = mt.topicId
                JOIN dim_envierments e on e.id = t.envId
                where u.id = ${id}` });
    let u = new User();
    let envs = {};
    profile_res.results.forEach(row => {
        if (!envs[row.envName])
            envs[row.envName] = [];
        envs[row.envName].push(row.topicName);
    });
    u.admin = profile_res.results[0].isAdmin;
    u.envs = envs;
    u.displayName = profile_res.results[0].displayName;
    u.imageUrl = profile_res.results[0].image;
    console.log(`fatch user ${JSON.stringify(u)}`);
    return u;
});
exports.User = User;
//# sourceMappingURL=user.js.map