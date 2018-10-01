"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let EditObject = class EditObject {
    constructor() {
        this.editModule = null;
        this.error = null;
        this.isNew = false;
        this.records = [];
        this.showModel = (edit) => {
            this.error = null;
            if (edit) {
                this.isNew = false;
                this.editModule = edit;
            }
            else {
                this.isNew = true;
                this.editModule = Object.assign(this.template.getEmptyInstance(), {});
            }
        };
        this.saveModel = () => {
            this.error = null;
            let validation = this.editModule.validate();
            if (!validation.status) {
                this.error = validation.error;
                return;
            }
            this.service.save(this.editModule).then((res) => {
                this.records = res;
                this.editModule = null;
            })
                .catch((e) => {
                this.error = JSON.stringify(e);
            });
        };
        this.deleteModel = () => {
            this.service.delete(this.editModule).then((res) => {
                this.records = res;
                this.editModule = null;
            })
                .catch((e) => {
                this.error = JSON.stringify(e);
            });
        };
        this.closeEditor = () => {
            this.editModule = null;
        };
        this.getJSONFields = (object) => {
            let resObject = {};
            for (var key in object) {
                if (object.hasOwnProperty(key) && typeof object[key] !== 'function') {
                    resObject[key] = object[key];
                }
            }
            return resObject;
        };
    }
    ngOnInit() {
        this.service.get().then((res) => {
            this.records = res;
        })
            .catch(err => {
            console.error(err);
        });
    }
};
__decorate([
    core_1.Input('service')
], EditObject.prototype, "service", void 0);
__decorate([
    core_1.Input('template')
], EditObject.prototype, "template", void 0);
__decorate([
    core_1.Input('settings')
], EditObject.prototype, "settings", void 0);
__decorate([
    core_1.ContentChild('tableTemplate')
], EditObject.prototype, "tableTemplate", void 0);
__decorate([
    core_1.ContentChild('editTemplate')
], EditObject.prototype, "editTemplate", void 0);
EditObject = __decorate([
    core_1.Component({
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
], EditObject);
exports.EditObject = EditObject;
//# sourceMappingURL=edit-object.comp.js.map