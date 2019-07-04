import {Component, Input, ChangeDetectorRef, Output, EventEmitter} from '@angular/core';
import { QueryBuilderConfig } from 'angular2-query-builder';

@Component({
  selector: 'query-builder-stream',
  template: `
  <query-builder [(ngModel)]='query' [allowRuleset]="false" (ngModelChange)="onChange()" [config]='config'></query-builder>

     `,
  styles:[`
   
  `]
})

export class QueryBuilderStream {

     config: QueryBuilderConfig = { fields:{

      }};
    
    @Output() filterChanged:EventEmitter<string> = new EventEmitter();

    query:{condition:string,rules:Array<any>}

    constructor(private ref:ChangeDetectorRef){
    }
  

    onChange() {
      let queryString = "* where ";
      if(this.query.condition ==  "and"){
         this.query.rules.map((role)=>{
           let operator = role.operator
           if(operator == "contains") operator = "~"
           if(operator == "like") operator = "~"
          return `${role.field} ${operator} ${role.value}`
         }).forEach((condition,index)=>{
          queryString +=  condition + (index != (this.query.rules.length -1)  ? (this.query.condition == "and" ? " && " : " || ") :"")
         })
      }
      console.log(queryString)
      this.filterChanged.emit(queryString)
   }

    
 }
