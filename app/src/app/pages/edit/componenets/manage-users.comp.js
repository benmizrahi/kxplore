"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const user_1 = require("../../../objects/user");
let ManageUsers = class ManageUsers {
    constructor(usersService) {
        this.usersService = usersService;
        this.settings = {
            headers: [
                {
                    title: 'User Email',
                    field: 'email',
                    sortable: {
                        enabled: false
                    }
                },
                {
                    title: 'Is Admin',
                    field: 'isAdmin',
                    sortable: {
                        enabled: false
                    }
                }
            ]
        };
        this.emptyTemplate = new user_1.User();
    }
};
ManageUsers = __decorate([
    core_1.Component({
        selector: 'users-edit',
        template: ` 
        <edit-panel [service]="usersService" [template]="emptyTemplate" [settings]="settings" >
            <ng-template  #tableTemplate let-items="items" let-funcs="funcs">  
                <ngx-lighttable [settings]="settings" (onClickRow)="funcs.edit($event)" [records]="items">
                    <ngx-lighttable-cell [field]="'email'">
                            <ng-template let-email>
                                {{email}}
                            </ng-template>
                    </ngx-lighttable-cell>
                    <ngx-lighttable-cell [field]="'isAdmin'">
                            <ng-template let-isAdmin>
                                 <nb-checkbox [value]="isAdmin">Is Admin</nb-checkbox>
                            </ng-template>
                </ngx-lighttable-cell>
             </ngx-lighttable> 
            </ng-template>
            <ng-template #editTemplate  let-data="data">  
                    <div  class="form-group">
                        <label >User Email</label>
                        <input class="form-control"  [(ngModel)]="data.email" placeholder="Email" type="text">
                    </div>
                    <div  class="form-group">
                        <nb-checkbox  [(ngModel)]="data.isAdmin">Is Admin</nb-checkbox>
                    </div>
            </ng-template>
        </edit-panel> `
    })
], ManageUsers);
exports.ManageUsers = ManageUsers;
//# sourceMappingURL=manage-users.comp.js.map