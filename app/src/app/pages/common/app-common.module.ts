import { NgModule } from "@angular/core";
import { WatingForConsumerComp } from "./componenets/wating-for-consumer.comp";
import { BrowserModule } from "@angular/platform-browser";
import { CommonModule } from "@angular/common";
import { EditObject } from "./componenets/edit-object.comp";
import { FormsModule } from "@angular/forms";
import { AceEditorModule } from "ng2-ace-editor";
import { NbCardModule } from "@nebular/theme";
import { NgXLightTableModule } from "ngx-lighttable";
import { NgxJsonViewerModule } from "ngx-json-viewer";
import { StreamSelector } from "./componenets/stream-selector.comp";

@NgModule({
    declarations: [
        WatingForConsumerComp,
        StreamSelector,
        EditObject
    ],
    imports:[
        CommonModule,
        BrowserModule,
        FormsModule,
        AceEditorModule,
        NbCardModule,
        NgXLightTableModule,
        NgxJsonViewerModule,],
    exports:[  
        StreamSelector,
        EditObject,
        WatingForConsumerComp]
   
})

export class AppCommonModule{

}