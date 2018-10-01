"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const manage_envs_comp_1 = require("./componenets/manage-envs.comp");
const manage_topics_comp_1 = require("./componenets/manage-topics.comp");
const manage_users_comp_1 = require("./componenets/manage-users.comp");
const env_manage_service_1 = require("./services/env-manage.service");
const router_1 = require("@angular/router");
const auth_guard_service_1 = require("../../services/auth-guard.service");
const app_common_module_1 = require("../common/app-common.module");
const topic_manage_service_1 = require("./services/topic-manage.service");
const users_manage_service_1 = require("./services/users-manage.service");
const manage_premissions_comp_1 = require("./componenets/manage-premissions.comp");
const premissions_manage_service_1 = require("./services/premissions-manage.service");
const common_1 = require("@angular/common");
const platform_browser_1 = require("@angular/platform-browser");
const forms_1 = require("@angular/forms");
const ng2_ace_editor_1 = require("ng2-ace-editor");
const theme_1 = require("@nebular/theme");
const ngx_lighttable_1 = require("ngx-lighttable");
const ngx_json_viewer_1 = require("ngx-json-viewer");
const routes = [
    { path: 'topics', component: manage_topics_comp_1.ManageTopics, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'users', component: manage_users_comp_1.ManageUsers, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'envierments', component: manage_envs_comp_1.ManageEnvs, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'userPremissions', component: manage_premissions_comp_1.ManagePremission, canActivate: [auth_guard_service_1.AuthGuard] }
];
let EditModule = class EditModule {
};
EditModule = __decorate([
    core_1.NgModule({
        declarations: [
            manage_envs_comp_1.ManageEnvs,
            manage_topics_comp_1.ManageTopics,
            manage_users_comp_1.ManageUsers,
            manage_premissions_comp_1.ManagePremission
        ],
        imports: [
            common_1.CommonModule,
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            ng2_ace_editor_1.AceEditorModule,
            theme_1.NbCardModule,
            theme_1.NbCheckboxModule,
            ngx_lighttable_1.NgXLightTableModule,
            ngx_json_viewer_1.NgxJsonViewerModule,
            router_1.RouterModule.forRoot(routes, {}),
            app_common_module_1.AppCommonModule
        ],
        providers: [env_manage_service_1.EnvManagmentService, premissions_manage_service_1.PremissionManage, topic_manage_service_1.TopicManageService, users_manage_service_1.UsersManageService],
        exports: [
            manage_envs_comp_1.ManageEnvs,
            manage_topics_comp_1.ManageTopics,
            manage_users_comp_1.ManageUsers
        ]
    })
], EditModule);
exports.EditModule = EditModule;
//# sourceMappingURL=edit.module.js.map