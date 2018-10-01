"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const topic_1 = require("../../../objects/topic");
let ManageTopics = class ManageTopics {
    constructor(topicsService, enviermentManage) {
        this.topicsService = topicsService;
        this.enviermentManage = enviermentManage;
        this.settings = {
            headers: [
                {
                    title: 'Envierment',
                    field: 'envName',
                    sortable: {
                        enabled: false
                    }
                },
                {
                    title: 'Topic',
                    field: 'topicName',
                    sortable: {
                        enabled: false
                    }
                }
            ],
            messages: {
                empty: 'No records found',
                loading: 'Loading records...' // Optional
            },
            allowMultipleSort: false,
            allowNeutralSort: true // Optional
        };
        this.emptyTemplate = new topic_1.Topic();
        enviermentManage.get().then(res => {
            this.envList = res;
        });
    }
};
ManageTopics = __decorate([
    core_1.Component({
        selector: 'topics-edit',
        template: ` <edit-panel [service]="topicsService" [template]="emptyTemplate" [settings]="settings">
                        <ng-template  #tableTemplate let-items="items" let-funcs="funcs">  
                            <ngx-lighttable [settings]="settings" (onClickRow)="funcs.edit($event)"  [records]="items">
                                <ngx-lighttable-cell [field]="'envName'">
                                        <ng-template let-envName>
                                            {{envName}}
                                        </ng-template>
                                </ngx-lighttable-cell>
                                <ngx-lighttable-cell [field]="'topicName'">
                                        <ng-template let-topicName>
                                            {{topicName}}
                                        </ng-template>
                                </ngx-lighttable-cell>
                            </ngx-lighttable> 
                    </ng-template>
                    <ng-template #editTemplate  let-data="data">  
                                 <label >Select Envierment</label>
                                    <select class="form-control" [(ngModel)]="data.envId">
                                            <option [value]="env.id" *ngFor="let env of envList">{{env.envName}}</option>
                                    </select>
                                    <div  class="form-group">
                                         <label >Select Topic</label>
                                        <input class="form-control"  [(ngModel)]="data.topicName" placeholder="TopicName" type="text">
                                    </div>
                    </ng-template>
          </edit-panel> `
    })
], ManageTopics);
exports.ManageTopics = ManageTopics;
//# sourceMappingURL=manage-topics.comp.js.map