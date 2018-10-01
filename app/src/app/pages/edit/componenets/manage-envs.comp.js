"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const envierment_1 = require("../../../objects/envierment");
let ManageEnvs = class ManageEnvs {
    constructor(managmentService) {
        this.managmentService = managmentService;
        this.pasringError = null;
        this.settings = {
            headers: [
                {
                    title: 'Envierment Name',
                    field: 'envName',
                    sortable: {
                        enabled: false
                    }
                },
                {
                    title: 'Manage Envierment Properties',
                    field: 'props',
                    sortable: {
                        enabled: false
                    }
                }
            ]
        };
        this.getPropsJSON = (props) => {
            return JSON.stringify(props, null, '\t');
        };
        this.onChange = (object, data) => {
            try {
                this.pasringError = null;
                let props = JSON.parse(data);
                object.props = props;
            }
            catch (e) {
                this.pasringError = e.message;
            }
        };
        this.emptyTemplate = new envierment_1.Envierment();
    }
};
ManageEnvs = __decorate([
    core_1.Component({
        selector: 'envierments-edit',
        template: ` <edit-panel [service]="managmentService" [template]="emptyTemplate" [settings]="settings" >
                    <ng-template  #tableTemplate let-items="items" let-funcs="funcs"> 
                        <ngx-lighttable [settings]="settings" (onClickRow)="funcs.edit($event)" [records]="items">
                            <ngx-lighttable-cell [field]="'envName'">
                                    <ng-template let-envName>
                                            {{envName}}
                                    </ng-template>
                            </ngx-lighttable-cell>
                            <ngx-lighttable-cell [field]="'props'">
                                    <ng-template let-props>
                                         <ngx-json-viewer [json]="props" [expanded]="false"></ngx-json-viewer>
                                    </ng-template>
                            </ngx-lighttable-cell>
                        </ngx-lighttable> 
                    </ng-template>
                    <ng-template #editTemplate  let-data="data">
                            <div  class="form-group">
                                <label >Select Topic</label>
                                <input class="form-control"  [(ngModel)]="data.envName" placeholder="Envierment Name" type="text">
                            </div>
                            <ace-editor (textChanged)="onChange(data,$event)" [text]="getPropsJSON(data.props)" mode="json" [theme]="'eclipse'" #editor style="height:300px;"></ace-editor>
                            <div class="row" *ngIf="pasringError">
                                <div *ngIf="pasringError" class="alert alert-danger" role="alert"><strong >Oh snap!</strong> JSON is not valid </div>
                            </div>
                     </ng-template>
                 </edit-panel> `,
    })
], ManageEnvs);
exports.ManageEnvs = ManageEnvs;
//# sourceMappingURL=manage-envs.comp.js.map