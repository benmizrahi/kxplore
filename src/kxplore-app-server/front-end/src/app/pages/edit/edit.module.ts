import { NgModule } from "@angular/core";
import { ManageEnvs } from "./componenets/manage-envs.comp";
import { ManageTopics } from "./componenets/manage-topics.comp";
import { ManageUsers } from "./componenets/manage-users.comp";
import { EnvManagmentService } from "./services/env-manage.service";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../services/auth-guard.service";
import { AppCommonModule } from "../common/app-common.module";
import { TopicManageService } from "./services/topic-manage.service";
import { UsersManageService } from "./services/users-manage.service";
import { ManagePremission } from "./componenets/manage-premissions.comp";
import { PremissionManage } from "./services/premissions-manage.service";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule } from "@angular/forms";
import { NbCardModule, NbCheckboxModule } from "@nebular/theme";
import { NgXLightTableModule } from "ngx-lighttable";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { NGX_MONACO_EDITOR_CONFIG, MonacoEditorModule, NgxMonacoEditorConfig } from "ngx-monaco-editor";

const routes: Routes = [
    { path: 'topics', component: ManageTopics  ,canActivate: [AuthGuard] },
    { path: 'users', component: ManageUsers,canActivate: [AuthGuard] },
    { path: 'environments', component: ManageEnvs,canActivate: [AuthGuard] },
    { path: 'userPremissions', component: ManagePremission,canActivate: [AuthGuard] }
  ];


  const monacoConfig: NgxMonacoEditorConfig = {
    baseUrl:"assets/",
    defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
    onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
  };


@NgModule({
    declarations: [
        ManageEnvs,
        ManageTopics,
        ManageUsers,
        ManagePremission
    ],
    imports:[ 
        CommonModule,
        BrowserModule,
        FormsModule,
        NbCardModule,
        NbCheckboxModule,
        NgXLightTableModule,
        NgxJsonViewerModule,
        RouterModule.forRoot(routes,{}),
        AppCommonModule,
        MonacoEditorModule.forRoot() 
    ],
    providers:[EnvManagmentService,PremissionManage,TopicManageService,UsersManageService,{ provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig }],
    exports:[  
        ManageEnvs,
        ManageTopics,
        ManageUsers]
    
})

export class EditModule{

}