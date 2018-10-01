import { NgModule } from "@angular/core";
import { KChartsView } from "./componenets/kcharts-view.comp";
import { NgxEchartsModule } from 'ngx-echarts';
import { Routes, RouterModule } from "@angular/router";
import { AuthGuard } from "../../services/auth-guard.service";
import { NbLayoutModule, NbTabsetModule, NbCardModule } from "@nebular/theme";
import { CommonModule } from "@angular/common";
import { BrowserModule } from "@angular/platform-browser";
import { AppCommonModule } from "../common/app-common.module";
import { AceEditorModule } from "ng2-ace-editor";
import { FormsModule } from "@angular/forms";
import { KChartsService } from "./services/kcharts.service";
import { ColorPickerModule } from 'ngx-color-picker';
import { NgDraggableWidgetModule } from 'ngx-draggable-widget';
import { EditChart } from "./componenets/edit-chat.comp";
import { ShowChart } from "./componenets/show-chart.comp";
import { NgxChartsModule } from "@swimlane/ngx-charts";


const routes: Routes = [
    { path: 'charts', component: KChartsView  ,canActivate: [AuthGuard] }
]

@NgModule({
    declarations: [
        KChartsView,EditChart,ShowChart],
    imports:[
        CommonModule,
        BrowserModule,
        FormsModule,
        AceEditorModule,
        NgxEchartsModule,
        NbLayoutModule,
        NbTabsetModule,
        NbCardModule,
        NgxChartsModule,
        RouterModule.forRoot(routes,{}),
        NgDraggableWidgetModule,
        ColorPickerModule,
        AppCommonModule],
    providers:[KChartsService],
    exports:[KChartsView]
})
export class KChartsModule {

}