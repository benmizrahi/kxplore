import { Component } from "@angular/core";
import { Envierment } from "../../../objects/envierment";
import { NgXLightTableSettings } from "ngx-lighttable/types/ngx-lighttable-settings.type";
import { EnvManagmentService } from "../services/env-manage.service";

@Component({
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
export class ManageEnvs {
    
    emptyTemplate:Envierment;
    pasringError:string = null;
    settings: NgXLightTableSettings = { 
        headers: 
        [  
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
    }   
    constructor(public readonly managmentService:EnvManagmentService) {
        this.emptyTemplate = new Envierment();
    }

    getPropsJSON = (props:Object) => {
        return JSON.stringify(props,null,'\t');
    }

    onChange = (object:Envierment,data) => {
        try{
            this.pasringError = null;
            let props = JSON.parse(data);
            object.props = props;
        }
        catch(e){
            this.pasringError = e.message
        }
    }
}