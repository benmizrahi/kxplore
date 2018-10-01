"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const platform_browser_1 = require("@angular/platform-browser");
const core_1 = require("@angular/core");
const theme_1 = require("@nebular/theme");
const router_1 = require("@angular/router");
const theme_2 = require("@nebular/theme");
const ngx_datatable_1 = require("@swimlane/ngx-datatable");
const http_1 = require("@angular/common/http");
const ngx_json_viewer_1 = require("ngx-json-viewer");
const app_comp_1 = require("./app.comp");
const common_1 = require("@angular/common");
const kafka_consumer_comp_1 = require("./pages/kafka-consumer.comp");
const user_area_comp_1 = require("./template/user-area.comp");
const ngx_socket_io_1 = require("ngx-socket-io");
const stream_consumer_service_1 = require("./services/stream-consumer.service");
const forms_1 = require("@angular/forms");
const auth_guard_service_1 = require("./services/auth-guard.service");
const login_page_comp_1 = require("./pages/login-page.comp");
const authentication_service_1 = require("./services/authentication.service");
const socket_kafka_service_1 = require("./services/socket-kafka.service");
const user_profile_service_1 = require("./services/user-profile.service");
const ngx_loading_1 = require("ngx-loading");
const ng2_ace_editor_1 = require("ng2-ace-editor");
const ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
const angular2_toaster_1 = require("angular2-toaster");
const animations_1 = require("@angular/platform-browser/animations");
const ngx_moment_1 = require("ngx-moment");
const ngx_charts_1 = require("@swimlane/ngx-charts");
const ng2_smart_table_1 = require("ng2-smart-table");
const filter_editor_comp_1 = require("./pages/filter-editor.comp");
const angular_font_awesome_1 = require("angular-font-awesome");
const ngx_lighttable_1 = require("ngx-lighttable");
const edit_module_1 = require("./pages/edit/edit.module");
const app_common_module_1 = require("./pages/common/app-common.module");
const charts_module_1 = require("./pages/charts/charts.module");
const routes = [
    {
        path: '',
        redirectTo: "/kafka",
        pathMatch: 'full',
        canActivate: [auth_guard_service_1.AuthGuard]
    },
    { path: 'kafka', component: kafka_consumer_comp_1.KafkaConsumer, canActivate: [auth_guard_service_1.AuthGuard] },
    { path: 'login', component: login_page_comp_1.LoginPageComp }
];
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        declarations: [
            app_comp_1.AppComponent,
            kafka_consumer_comp_1.KafkaConsumer,
            user_area_comp_1.UserAreaComp,
            login_page_comp_1.LoginPageComp,
            filter_editor_comp_1.FilterEditor,
        ],
        imports: [
            common_1.CommonModule,
            animations_1.BrowserAnimationsModule,
            forms_1.FormsModule,
            ngx_datatable_1.NgxDatatableModule,
            platform_browser_1.BrowserModule,
            ng_bootstrap_1.NgbButtonsModule,
            router_1.RouterModule.forRoot(routes, {}),
            theme_1.NbThemeModule.forRoot({ name: 'default' }),
            theme_2.NbLayoutModule,
            theme_2.NbSidebarModule,
            theme_1.NbCardModule,
            theme_1.NbMenuModule.forRoot(),
            theme_1.NbUserModule,
            theme_1.NbActionsModule,
            ngx_socket_io_1.SocketIoModule,
            http_1.HttpClientModule,
            ngx_loading_1.LoadingModule,
            ngx_json_viewer_1.NgxJsonViewerModule,
            ng2_ace_editor_1.AceEditorModule,
            ng_bootstrap_1.NgbModule.forRoot(),
            theme_1.NbContextMenuModule,
            angular2_toaster_1.ToasterModule.forRoot(),
            ngx_moment_1.MomentModule,
            ngx_charts_1.NgxChartsModule,
            theme_1.NbTabsetModule,
            ng2_smart_table_1.Ng2SmartTableModule,
            ng_bootstrap_1.NgbPopoverModule,
            ngx_lighttable_1.NgXLightTableModule,
            angular_font_awesome_1.AngularFontAwesomeModule,
            app_common_module_1.AppCommonModule,
            edit_module_1.EditModule,
            charts_module_1.KChartsModule
        ],
        providers: [
            theme_2.NbSidebarService,
            { provide: common_1.APP_BASE_HREF, useValue: '/' },
            stream_consumer_service_1.StreamConsumerService,
            authentication_service_1.AuthenticationService,
            auth_guard_service_1.AuthGuard,
            socket_kafka_service_1.SocketKafkaService,
            user_profile_service_1.UserProfileService,
            { provide: core_1.APP_INITIALIZER, useFactory: jokesProviderFactory, deps: [user_profile_service_1.UserProfileService], multi: true }
        ],
        bootstrap: [app_comp_1.AppComponent],
        entryComponents: []
    })
], AppModule);
exports.AppModule = AppModule;
function jokesProviderFactory(provider) {
    return () => provider.getUserProfile();
}
exports.jokesProviderFactory = jokesProviderFactory;
//# sourceMappingURL=app.module.js.map