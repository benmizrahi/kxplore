"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
require("brace/mode/sql");
let FilterEditor = class FilterEditor {
    constructor() {
        this.filterChanged = new core_1.EventEmitter();
    }
    ngAfterViewInit() {
        this.editor.getEditor().setOptions({
            enableBasicAutocompletion: true
        });
        this.editor.getEditor().commands.addCommand({
            name: "showOtherCompletions",
            bindKey: "Ctrl-.",
            exec: function (editor) {
            }
        });
    }
};
__decorate([
    core_1.Output()
], FilterEditor.prototype, "filterChanged", void 0);
__decorate([
    core_1.ViewChild('editor')
], FilterEditor.prototype, "editor", void 0);
__decorate([
    core_1.Input('filter')
], FilterEditor.prototype, "filter", void 0);
FilterEditor = __decorate([
    core_1.Component({
        selector: 'filter-editor',
        template: `
        <ace-editor
            [(text)]="filter.value" mode="sql" [text]="content" [theme]="'eclipse'" [options]="{maxLines: '3',minLines:'3'}"
            #editor style="height:200px;"></ace-editor>
  `,
        styles: [`
  .aceEditorDirective {
    margin-top: 50px;
    min-height: 200px;
    width: 100%;
    overflow: auto;
  }
  `]
    })
], FilterEditor);
exports.FilterEditor = FilterEditor;
//# sourceMappingURL=filter-editor.comp.js.map