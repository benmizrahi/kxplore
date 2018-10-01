import {Component, Input, AfterViewInit, OnDestroy, ViewChild, Output,EventEmitter} from '@angular/core';
import 'brace/mode/sql';

@Component({
  selector: 'filter-editor',
  template: `
        <ace-editor
            [(text)]="filter.value" mode="sql" [text]="content" [theme]="'eclipse'" [options]="{maxLines: '3',minLines:'3'}"
            #editor style="height:200px;"></ace-editor>
  `,
  styles:[`
  .aceEditorDirective {
    margin-top: 50px;
    min-height: 200px;
    width: 100%;
    overflow: auto;
  }
  `]
})

export class FilterEditor implements AfterViewInit {
   
    @Output() filterChanged:EventEmitter<string> = new EventEmitter();

    @ViewChild('editor') editor;

    @Input('filter') filter;

    ngAfterViewInit() {
 
        this.editor.getEditor().setOptions({
            enableBasicAutocompletion: true
        });
 
        this.editor.getEditor().commands.addCommand({
            name: "showOtherCompletions",
            bindKey: "Ctrl-.",
            exec: function (editor) {
 
            }
        })
    }

}
