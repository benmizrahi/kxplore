import { BrowserModule } from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {
  NbActionsModule, NbCardModule, NbContextMenuModule, NbMenuModule, NbTabsetModule, NbThemeModule,
  NbUserModule,
  NbPopoverModule
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
import { AceEditorModule } from 'ng2-ace-editor';
import { NgbModule, NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';
import {ToasterModule} from "angular2-toaster";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import { MomentModule } from 'ngx-moment';
import { Ng2SmartTableModule} from 'ng2-smart-table';
import { FilterEditor } from './pages/filter-editor.comp';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import {NgXLightTableModule} from 'ngx-lighttable';
import { EditModule } from './pages/edit/edit.module';
import { AppCommonModule } from './pages/common/app-common.module';
import { KChartsModule } from './pages/charts/charts.module';


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
    LoginPageComp,
    FilterEditor,
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
    NbActionsModule,
    SocketIoModule,
    HttpClientModule,
    LoadingModule,
    NgxJsonViewerModule,
    AceEditorModule,
    NgbModule.forRoot(),
    NbContextMenuModule,
    ToasterModule.forRoot(),
    MomentModule,
    NbTabsetModule,
    Ng2SmartTableModule,
    NbPopoverModule,
    NgXLightTableModule,
    AngularFontAwesomeModule,
    AppCommonModule,
    EditModule,
    KChartsModule
  ],
  providers: [
    NbSidebarService,
    { provide: APP_BASE_HREF, useValue: '/' },
    StreamConsumerService,
    AuthenticationService,
    AuthGuard,
    SocketKafkaService,
    UserProfileService,
    { provide: APP_INITIALIZER, useFactory: jokesProviderFactory, deps: [UserProfileService], multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents:[]
})
export class AppModule {


}
export function jokesProviderFactory(provider: UserProfileService) {
  return () => provider.getUserProfile();
}
