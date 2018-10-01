"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const premissions_1 = require("../../../objects/premissions");
let ManagePremission = class ManagePremission {
    constructor(premissionManage, usersManage, enviermentManage, topicsManage) {
        this.premissionManage = premissionManage;
        this.usersManage = usersManage;
        this.enviermentManage = enviermentManage;
        this.topicsManage = topicsManage;
        this.settings = {
            headers: [
                {
                    title: 'Email',
                    field: 'email',
                    sortable: {
                        enabled: false
                    }
                },
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
            ]
        };
        this.getTopicInEnvierment = (id) => {
            return this.topicsList.filter((x) => {
                return x.envId == id;
            });
        };
        this.getUserName = (uId) => {
            if (uId == -1)
                return;
            return this.usersList.find(x => {
                return x.id == uId;
            }).email;
        };
        this.emptyTemplate = new premissions_1.Premissions();
        Promise.all([usersManage.get(), enviermentManage.get(), topicsManage.get()]).then(res => {
            this.usersList = res[0];
            this.envList = res[1];
            this.topicsList = res[2];
        });
    }
};
ManagePremission = __decorate([
    core_1.Component({
        selector: 'premissions-edit',
        template: `
          <edit-panel [service]="premissionManage" [template]="emptyTemplate" [settings]="settings">
                <ng-template  #tableTemplate let-items="items" let-funcs="funcs">
                        <ngx-lighttable [settings]="settings" (onClickRow)="funcs.edit($event)"  [records]="items">
                            <ngx-lighttable-cell [field]="'email'">
                                    <ng-template let-email>
                                        {{email}}
                                    </ng-template>
                            </ngx-lighttable-cell>
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
                        <div class="form-group">
                        <label>Select User</label>
                        <select class="form-control" [(ngModel)]="data.uId">
                            <option [value]="user.id" *ngFor="let user of usersList">{{user.email}}</option>
                        </select>
                    </div>
                    <div class="form-group">
                            <label >Select Envierment</label>
                            <select class="form-control" [(ngModel)]="data.eId">
                                <option [value]="env.id" *ngFor="let env of envList">{{env.envName}}</option>
                            </select>
                            <label>Select Topic</label>
                            <select class="form-control" [(ngModel)]="data.tId">
                                <option [value]="topic.id" *ngFor="let topic of getTopicInEnvierment(data.eId)">{{topic.topicName}}</option>
                            </select>
                    </div>
                </ng-template> 
                
          </edit-panel>
    `
    })
], ManagePremission);
exports.ManagePremission = ManagePremission;
//# sourceMappingURL=manage-premissions.comp.js.map