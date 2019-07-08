import { Component } from "@angular/core";
import { Environment } from "../../../objects/environment";
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
                                <label>Select Topic</label>
                                <input class="form-control"  [(ngModel)]="data.envName" placeholder="Envierment Name" type="text">
                            </div>
                            <div class="row" *ngIf="pasringError">
                                <div *ngIf="pasringError" class="alert alert-danger" role="alert"><strong >Oh snap!</strong> JSON is not valid </div>
                            </div>
                     </ng-template>
                 </edit-panel> `,
})
export class ManageEnvs {
    
    editorOptions = {theme: 'vs', language: 'json',lineNumbers:true,automaticLayout: true,minimap: {
		enabled: false
     }};
    
    emptyTemplate:Environment;
    pasringError:string = null;
    settings: NgXLightTableSettings = { 
        headers: 
        [  
             {
                title: 'Environment Name',
                field: 'envName',
                sortable: {
                    enabled: false
                }
            },
            {
                title: 'Manage Environment Properties',
                field: 'props',
                sortable: {
                    enabled: false
                }
            }
          ]
    }   
    constructor(public readonly managmentService:EnvManagmentService) {
        this.emptyTemplate = new Environment();
    }

    private original_props:string
     
   

    getPropsJSON = (props:Object) => {
        if(!this.original_props){
            this.original_props = JSON.stringify(props,null,'\t')
        }
        return {
            value:this.original_props,
            language: 'json'
        }
    }

    onChange = (object:Environment,data) => {
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