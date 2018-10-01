"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const wating_for_consumer_comp_1 = require("./componenets/wating-for-consumer.comp");
const platform_browser_1 = require("@angular/platform-browser");
const common_1 = require("@angular/common");
const edit_object_comp_1 = require("./componenets/edit-object.comp");
const forms_1 = require("@angular/forms");
const ng2_ace_editor_1 = require("ng2-ace-editor");
const theme_1 = require("@nebular/theme");
const ngx_lighttable_1 = require("ngx-lighttable");
const ngx_json_viewer_1 = require("ngx-json-viewer");
const stream_selector_comp_1 = require("./componenets/stream-selector.comp");
let AppCommonModule = class AppCommonModule {
};
AppCommonModule = __decorate([
    core_1.NgModule({
        declarations: [
            wating_for_consumer_comp_1.WatingForConsumerComp,
            stream_selector_comp_1.StreamSelector,
            edit_object_comp_1.EditObject
        ],
        imports: [
            common_1.CommonModule,
            platform_browser_1.BrowserModule,
            forms_1.FormsModule,
            ng2_ace_editor_1.AceEditorModule,
            theme_1.NbCardModule,
            ngx_lighttable_1.NgXLightTableModule,
            ngx_json_viewer_1.NgxJsonViewerModule,
        ],
        exports: [
            stream_selector_comp_1.StreamSelector,
            edit_object_comp_1.EditObject,
            wating_for_consumer_comp_1.WatingForConsumerComp
        ]
    })
], AppCommonModule);
exports.AppCommonModule = AppCommonModule;
//# sourceMappingURL=app-common.module.js.map