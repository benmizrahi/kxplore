import { NgModule } from "@angular/core";
import { WatingForConsumerComp } from "./componenets/wating-for-consumer.comp";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { EditObject } from "./componenets/edit-object.comp";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NbCardModule } from "@nebular/theme";
import { NgXLightTableModule } from "ngx-lighttable";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { StreamSelector } from "./componenets/stream-selector.comp";
import { ConfigColumns } from "./componenets/config-columns";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NbDatepickerModule } from '@nebular/theme';


@NgModule({
    declarations: [
        WatingForConsumerComp,
        StreamSelector,
        EditObject,
        ConfigColumns
    ],
    imports:[
        CommonModule,
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        NbCardModule,
        NgXLightTableModule,
        NbDatepickerModule.forRoot(),
        NgxJsonViewerModule
],
    exports:[  
        StreamSelector,
        EditObject,
        WatingForConsumerComp,
        ConfigColumns]
})

export class AppCommonModule{

}