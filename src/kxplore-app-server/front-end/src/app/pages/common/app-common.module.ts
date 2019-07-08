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
import { NGX_MONACO_EDITOR_CONFIG, MonacoEditorModule, NgxMonacoEditorConfig } from "ngx-monaco-editor";
import {  NbLayoutModule } from '@nebular/theme'

const monacoConfig: NgxMonacoEditorConfig = {
    baseUrl:"assets/",
    defaultOptions: { scrollBeyondLastLine: false }, // pass default options to be used
    onMonacoLoad: () => { console.log((<any>window).monaco); } // here monaco object will be available as window.monaco use this function to extend monaco editor functionalities.
  };

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
        NbLayoutModule,
        NbDatepickerModule.forRoot(),
        NgxJsonViewerModule,
        MonacoEditorModule.forRoot() 
],
    exports:[  
        StreamSelector,
        EditObject,
        WatingForConsumerComp,
        ConfigColumns]
        ,providers:[    { provide: NGX_MONACO_EDITOR_CONFIG, useValue: monacoConfig }
        ]
})

export class AppCommonModule{

}