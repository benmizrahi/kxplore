import { Component } from "@angular/core";
import { User } from "../../../objects/user";
import { NgXLightTableSettings } from "ngx-lighttable/types/ngx-lighttable-settings.type";
import { UsersManageService } from "../services/users-manage.service";

@Component({
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
export class ManageUsers {
      
    public emptyTemplate:User;

    settings: NgXLightTableSettings = { 
        headers: 
        [  
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
    }

    constructor(public readonly usersService:UsersManageService) {
        this.emptyTemplate = new User();
    }
}