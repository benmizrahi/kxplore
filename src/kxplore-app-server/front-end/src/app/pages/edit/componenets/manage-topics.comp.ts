import { Component } from "@angular/core";
import { Topic } from "../../../objects/topic";
import { NgXLightTableSettings } from "ngx-lighttable/types/ngx-lighttable-settings.type";
import { TopicManageService } from "../services/topic-manage.service";
import { EnvManagmentService } from "../services/env-manage.service";
import { Environment } from "../../../objects/environment";

@Component({
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
export class ManageTopics {
  
    public emptyTemplate:Topic;

    settings: NgXLightTableSettings = { 
        headers: 
        [  
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
            empty: 'No records found', // Optional
            loading: 'Loading records...' // Optional
          },
          allowMultipleSort: false, // Optional
          allowNeutralSort: true // Optional
    }

    public envList:Array<Environment>
    public topicsList:Array<Topic>

    constructor(public readonly topicsService:TopicManageService,
        public readonly enviermentManage:EnvManagmentService) {
            this.emptyTemplate = new Topic();
            enviermentManage.get().then(res => {
                this.envList = res
            })
    }

    

}