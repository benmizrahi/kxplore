import { NgModule } from "@angular/core";
import { WatingForConsumerComp } from "./componenets/wating-for-consumer.comp";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { EditObject } from "./componenets/edit-object.comp";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AceEditorModule } from "ng2-ace-editor";
import { NbCardModule } from "@nebular/theme";
import { NgXLightTableModule } from "ngx-lighttable";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { StreamSelector } from "./componenets/stream-selector.comp";
import { QueryBuilderModule } from "angular2-query-builder";
import { ConfigColumns } from "./componenets/config-columns";
import { QueryBuilderStream } from "./componenets/query-builder.comp";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";
import { NbDatepickerModule } from '@nebular/theme';
@NgModule({
    declarations: [
        WatingForConsumerComp,
        StreamSelector,
        EditObject,
        ConfigColumns,
        QueryBuilderStream
    ],
    imports:[
        CommonModule,
        BrowserModule,
        FormsModule,
        AceEditorModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
        NbCardModule,
        NgXLightTableModule,
        NbDatepickerModule.forRoot(),
        NgxJsonViewerModule,
        QueryBuilderModule],
    exports:[  
        StreamSelector,
        EditObject,
        WatingForConsumerComp,
        ConfigColumns,
        QueryBuilderStream]
})

export class AppCommonModule{

}