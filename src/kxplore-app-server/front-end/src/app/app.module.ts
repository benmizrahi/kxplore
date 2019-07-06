import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {
  NbActionsModule, NbCardModule, NbContextMenuModule, NbMenuModule, NbTabsetModule, NbThemeModule,
  NbUserModule,
  NbPopoverModule,
  NbDialogModule
} from '@nebular/theme';
import {RouterModule, Routes} from '@angular/router';
import { NbSidebarModule, NbLayoutModule, NbSidebarService } from '@nebular/theme'
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { HttpClientModule } from '@angular/common/http';
import { NgxJsonViewerModule } from 'ngx-json-viewer';

import { AppComponent } from './app.comp';
import {APP_BASE_HREF, CommonModule} from "@angular/common";
import {KafkaConsumer} from "./pages/kafka-consumer.comp";
import {UserAreaComp} from "./template/user-area.comp";
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import {StreamConsumerService} from "./services/stream-consumer.service";
import {FormsModule} from '@angular/forms';
import {AuthGuard} from "./services/auth-guard.service";
import {LoginPageComp} from "./pages/login-page.comp";
import {AuthenticationService} from './services/authentication.service';
import {SocketKafkaService} from "./services/socket-kafka.service";
import {UserProfileService} from "./services/user-profile.service";
import {LoadingModule} from "ngx-loading";
import { NgbModule, NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MomentModule } from 'ngx-moment';
import { Ng2SmartTableModule} from 'ng2-smart-table';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { EditModule } from './pages/edit/edit.module';
import { AppCommonModule } from './pages/common/app-common.module';
import { NGX_MONACO_EDITOR_CONFIG, MonacoEditorModule, NgxMonacoEditorConfig } from "ngx-monaco-editor";

const monacoConfig: NgxMonacoEditorConfig = {
    baseUrl:"assets/",
    defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
    onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
  };
  
const routes: Routes = [
  {
    path: '',
    redirectTo: "/kafka",
    pathMatch: 'full',
    canActivate: [AuthGuard]
  },
  { path: 'kafka', component: KafkaConsumer,canActivate: [AuthGuard] },
  { path: 'login', component: LoginPageComp }

];

@NgModule({
  declarations: [
    AppComponent,
    KafkaConsumer,
    UserAreaComp,
    LoginPageComp
  ],

  imports: [
    CommonModule,
    BrowserAnimationsModule,
    FormsModule,
    NgxDatatableModule,
    BrowserModule,
    NgbButtonsModule,
    RouterModule.forRoot(routes,{}),
    NbThemeModule.forRoot({ name: 'default' }),
    NbLayoutModule,
    NbSidebarModule,
    NbCardModule,
    NbMenuModule.forRoot(),
    NbUserModule,
    NbDialogModule.forRoot(),
    NbActionsModule,
    SocketIoModule,
    HttpClientModule,
    LoadingModule,
    NgxJsonViewerModule,
    NgbModule.forRoot(),
    NbContextMenuModule, 
    MomentModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    NbPopoverModule,
    AngularFontAwesomeModule,
    AppCommonModule,
    EditModule,
    MonacoEditorModule.forRoot()  ],
  providers: [
    NbSidebarService,
    
    { provide: APP_BASE_HREF, useValue: '/' },
    StreamConsumerService,
    AuthenticationService,
    AuthGuard,
    SocketKafkaService,
    UserProfileService,
    { provide: APP_INITIALIZER, useFactory: jokesProviderFactory, deps: [UserProfileService], multi: true },
    { provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig }
  ],
  bootstrap: [AppComponent],
  entryComponents:[]
})
export class AppModule {


}
export function jokesProviderFactory(provider: UserProfileService) {
  return () => provider.getUserProfile();
}
