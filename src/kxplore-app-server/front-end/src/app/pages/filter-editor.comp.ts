// import {Component, Input, AfterViewInit, OnDestroy, ViewChild, Output,EventEmitter} from '@angular/core';
// import 'brace/mode/sql';
// import { QueryBuilderConfig } from 'angular2-query-builder';

// @Component({
//   selector: 'filter-editor',
//   template: `
//       <ace-editor
//       mode="sql" [text]="content" [theme]="'eclipse'"
//       [options]="{maxLines: '3',minLines:'3'}"
//       (textChanged)="onChange($event)"
//     #editor style="height:200px;"></ace-editor>
//   `,
//   styles:[`
//     .aceEditorDirective {
//         margin-top: 50px;
//         min-height: 200px;
//         width: 100%;
//         overflow: auto;
//     }
//   `]
  
// })

// export class FilterEditor implements AfterViewInit {
   
//     @Output() filterChanged:EventEmitter<string> = new EventEmitter();

//     @ViewChild('editor') editor;

//     ngAfterViewInit() {
 
//         this.editor.getEditor().setOptions({
//             enableBasicAutocompletion: true
//         });
 
//         this.editor.getEditor().commands.addCommand({
//             name: "showOtherCompletions",
//             bindKey: "Ctrl-.",
//             exec: function (editor) {
 
//             }
//         })
//     }

//     onChange(code) {
//        this.filterChanged.emit(code)
//     }

// }
