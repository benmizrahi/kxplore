"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const kcharts_view_comp_1 = require("./componenets/kcharts-view.comp");
const ngx_echarts_1 = require("ngx-echarts");
const router_1 = require("@angular/router");
const auth_guard_service_1 = require("../../services/auth-guard.service");
const theme_1 = require("@nebular/theme");
const common_1 = require("@angular/common");
const platform_browser_1 = require("@angular/platform-browser");
const app_common_module_1 = require("../common/app-common.module");
const ng2_ace_editor_1 = require("ng2-ace-editor");
const forms_1 = require("@angular/forms");
const kcharts_service_1 = require("./services/kcharts.service");
const ngx_color_picker_1 = require("ngx-color-picker");
const ngx_draggable_widget_1 = require("ngx-draggable-widget");
const routes = [
    { path: 'charts', component: kcharts_view_comp_1.KChartsView, canActivate: [auth_guard_service_1.AuthGuard] }
];
let KChartsModule = class KChartsModule {
};
KChartsModule = __decorate([
    core_1.NgModule({
        declarations: [kcharts_view_comp_1.KChartsView],
        imports: [
            common_1.CommonModule,
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            ng2_ace_editor_1.AceEditorModule,
            ngx_echarts_1.NgxEchartsModule,
            theme_1.NbLayoutModule,
            theme_1.NbTabsetModule,
            theme_1.NbCardModule,
            router_1.RouterModule.forRoot(routes, {}),
            ngx_draggable_widget_1.NgDraggableWidgetModule,
            ngx_color_picker_1.ColorPickerModule,
            app_common_module_1.AppCommonModule
        ],
        providers: [kcharts_service_1.KChartsService],
        exports: [kcharts_view_comp_1.KChartsView]
    })
], KChartsModule);
exports.KChartsModule = KChartsModule;
//# sourceMappingURL=charts.module.js.map