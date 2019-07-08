import { Component } from "@angular/core";
import { PremissionManage } from "../services/premissions-manage.service";
import { NgXLightTableSettings } from "ngx-lighttable/types/ngx-lighttable-settings.type";
import { UsersManageService } from "../services/users-manage.service";
import { EnvManagmentService } from "../services/env-manage.service";
import { TopicManageService } from "../services/topic-manage.service";
import { User } from "../../../objects/user";
import { AbstractExtendedWebDriver } from "protractor/built/browser";
import { Environment } from "../../../objects/environment";
import { Topic } from "../../../objects/topic";
import { Premissions } from "../../../objects/premissions";

@Component({
    selector: 'premissions-edit',
    template:  `
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
export class ManagePremission {

    usersList:Array<User>
    envList:Array<Environment>
    topicsList:Array<Topic>
    emptyTemplate:Premissions;

    constructor(public readonly premissionManage:PremissionManage,
        public readonly usersManage:UsersManageService,
        public readonly enviermentManage:EnvManagmentService,
        public readonly topicsManage:TopicManageService
    ){
        this.emptyTemplate = new Premissions();
        Promise.all([usersManage.get(), enviermentManage.get(),topicsManage.get()]).then(res=>{
            this.usersList = res[0]
            this.envList = res[1]
            this.topicsList = res[2]
        });
    }

    settings: NgXLightTableSettings = { 
        headers: 
        [  
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
    }

    getTopicInEnvierment = (id) => {
       return this.topicsList.filter((x)=>{
            return x.envId == id
        })
    }

    getUserName = (uId) => {
        if(uId == -1) return;
        return this.usersList.find(x=>{
           return x.id == uId
        }).email
    }
}