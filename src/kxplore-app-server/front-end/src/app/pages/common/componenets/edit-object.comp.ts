import { Component, Input, OnInit, Output, ContentChild, TemplateRef } from "@angular/core";
import { NgXLightTableSettings } from "ngx-lighttable/types/ngx-lighttable-settings.type";
import { IEditeable } from "../../../objects/IEditable";
import { IObjectService } from "../../../objects/IObjectService";

@Component({
    selector: 'edit-panel',
    template: `
             <consumer-wait *ngIf="!records" [title]="'Loading Data'"></consumer-wait>
             <div class="row" style="margin-top: 15px; background: white;" *ngIf="records">
                  <div  [ngClass]="{'col-lg-6': editModule != null, 'col-lg-12':!editModule }">   
                        <i class="fa fa-plus add-new" (click)="showModel()"></i>   
                        <ng-container *ngTemplateOutlet="tableTemplate; context: { items: this.records,funcs: { edit : this.showModel,getJSONFields: this.getJSONFields } }">
                        </ng-container>    
                </div>
                <div class="col-lg-6" style="padding-top: 15px;" *ngIf="editModule != null">
                     <nb-card>
                             <nb-card-header>
                                {{ editModule ? 'Edit' : 'Add'}}
                                <i class="fa fa-close close-window"  (click)="closeEditor()"></i>
                             </nb-card-header>
                                <nb-card-body>
                                        <ng-container *ngTemplateOutlet="editTemplate; context: { data: this.editModule }">
                                        </ng-container>   
                                </nb-card-body>
                              <nb-card-footer>    
                                    <div class="row" *ngIf="error">
                                        <div *ngIf="error" class="alert alert-danger" role="alert"><strong >Oh snap!</strong> {{error}} </div>
                                    </div>
                                    <div class="row">
                                        <div class='col-lg-6'>
                                           <button class="btn btn-sm btn-success btn-semi-round" (click)="saveModel()">Save</button>
                                        </div>
                                        <div class='col-lg-6' style="text-align:right;">
                                             <button class="btn btn-sm btn-danger btn-semi-round" *ngIf="!isNew" (click)="deleteModel()" >Delete</button>
                                        </div>
                                     </div>
                            </nb-card-footer>
                    </nb-card>
                </div>
             </div>
    
    `
})
export class EditObject  implements OnInit{
    
    editModule:IEditeable = null
    error = null
    isNew = false;

    records:Array<any> = [];

    @Input('service') service:IObjectService;

    @Input('template') template:IEditeable;

    @Input('settings') settings: NgXLightTableSettings

  
    @ContentChild('tableTemplate') tableTemplate: TemplateRef<any>;
  
    @ContentChild('editTemplate') editTemplate: TemplateRef<any>;
  

    ngOnInit() {
        this.service.get().then((res)=>{
            this.records = res
        })
        .catch(err=>{
            console.error(err);
        })
    }

    showModel = (edit?:any) =>{
        this.error = null
        if(edit){
             this.isNew = false;
             this.editModule = edit
        }
         else{  
              this.isNew = true;
              this.editModule = Object.assign(this.template.getEmptyInstance(),{});
         }
    }


    saveModel = () => {
        this.error = null
        let validation = this.editModule.validate()
        if(!validation.status){
            this.error = validation.error;
            return;
        }
        this.service.save(this.editModule).then((res)=>{
            this.records = res;
            this.editModule = null
        })
        .catch((e)=>{
            this.error = JSON.stringify(e);
        })
    }

    deleteModel = () => {
        this.service.delete(this.editModule).then((res)=>{
            this.records = res
            this.editModule = null
        })
        .catch((e)=>{
            this.error = JSON.stringify(e);
        })
    }

    closeEditor = () => {
        this.editModule = null
    }

    getJSONFields = (object:IEditeable) => {
        let resObject = {}
        for(var key in object) {
            if(object.hasOwnProperty(key) && typeof object[key] !== 'function') {
                resObject[key] = object[key];
            }
        }
        return resObject;
    }
}