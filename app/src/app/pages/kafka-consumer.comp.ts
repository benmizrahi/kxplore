import {Component, ChangeDetectorRef, ViewChild, TemplateRef} from '@angular/core';
import {StreamConsumerService} from "../services/stream-consumer.service";
import { UserProfileService } from '../services/user-profile.service';
import { NbDialogService } from '@nebular/theme';
import { QueryBuilderConfig } from 'angular2-query-builder';
declare var Papa:any

@Component({
  selector: 'kafka-table-obj',
  template: `
  <nb-layout>
    <nb-layout-header style="padding: 0 0rem 0.75rem !important;">
        <stream-selector  style="width: 100%;"></stream-selector>
    </nb-layout-header>
  <nb-layout-column style="position: relative;">
    <consumer-wait *ngIf="getKeys(streamConsumerService.connectionsList).length == 0" [title]="'No Active Connections'"></consumer-wait>
    <nb-tabset (changeTab)="tabChanged($event)">
      <nb-tab *ngFor="let connection of getKeys(streamConsumerService.connectionsList)" tabTitle="{{getTabName(connection)}}" [id]="connection" [active]="connection == getActiveTab()"> 
      <div class="row">
          <div class="col-lg-12">
          <div class="row">
               <div class="col-lg-12 header-clean">
                <nb-card style="margin-bottom:0">
                  <nb-card-header>
                  <div class="row">
                    <div class="col-lg-9">    
                        <query-builder-stream (filterChanged)="applyFilter(connection,$event)" [config]="streamConsumerService.connectionsList[connection].avalibleColumns"></query-builder-stream>
                    </div>
                    <div class="col-lg-3">
                      <div class="stream-controller">
                          <i *ngIf=!isStreamAlive(connection) (click)="resumeStreaming(connection)" class="fa fa-play fa-x3" style="color: green;"></i>
                          <i *ngIf=isStreamAlive(connection) (click)="stopStreaming(connection)" class="fa fa-stop fa-x3" style="color: #9e1414e3;"></i>
                          <i class="fa fa-file-o"  (click)="downloadObjectAsJson(connection)"></i>
                          <i class="fa fa-file-excel-o"  (click)="downloadObjectAsCSV(connection)"></i>
                          <i class="fa fa-close fa-x3" style="color: #232223;" (click)="closeStream(connection)"></i>
                          <div> {{streamConsumerService.connectionsList[connection].counter }} Items</div>
                      </div>
                    </div>
                </div>
           </nb-card-header>
           <nb-card-body style=" padding: 0;">
              <consumer-wait *ngIf="!ifRowsExists(connection)" [title]="isStreamAlive(connection) ? 'Waiting For Data...' : 'Stream Lost :('" [showLoading]="isStreamAlive(connection)"></consumer-wait>
              <div class="row" style="margin: 0;    padding: 10px;">    
              <div *ngIf="ifRowsExists(connection)" class="header-clean col-lg-6"> 
                        <ngx-datatable class="material" 
                         [loadingIndicator]="isStreamAlive(connection)"
                          [columnMode]="'force'"
                          style="height: 650px;"
                          [rowHeight]="50"
                          [headerHeight]="50"
                          [scrollbarV]="true"
                          [scrollbarH]="false"
                          (select)="onSelect(connection,$event)"
                          [selectionType]="'single'"
                          (tableContextmenu)="onTableContextMenu($event)"
                          [rows]="getRowsByConnection(connection)">                            
                              <ngx-datatable-column [sortable]="true" [draggable]="true" *ngFor="let column of columns" name="{{column}}" prop="message">
                                <ng-template let-value="value" ngx-datatable-cell-template>
                                    <strong>{{getCellValue(column,value)}}</strong>
                                </ng-template>
                              </ngx-datatable-column>
                          </ngx-datatable>
                    </div>
                    <div  class="col-lg-4 header-clean" *ngIf="streamConsumerService.connectionsList[connection].selectedJSON">
                        <i class="fa fa-close fa-x3" style="color: #232223;" (click)="clearSelected(connection)"></i>
                        <ngx-json-viewer [json]="streamConsumerService.connectionsList[connection].selectedJSON" [expanded]="false"></ngx-json-viewer>
                    </div>  
                    </div>
                </nb-card-body>
            </nb-card>
            </div>
           </div>
          </div>
         </div>

         <ng-template #dialog let-data let-ref="dialogRef">
            <nb-card [style.width.px]="500" [style.height.px]="300">
              <nb-card-header>
                  Edit Columns
                  <div class="buttons" (click)="ref.close()" style="float: right;">
                        <i class="nb-close"></i>
                  </div>
              </nb-card-header>
                <nb-card-body>
                    <div class="row" *ngIf="data !== 'ALL'">
                          <div class="col-md-6"> Delete <strong> {{ data }} </strong> column</div>
                          <div class="col-md-6"> <button nbButton class="btn-xsmall btn-danger" (click)="removeColumn(data,ref)">Delete</button></div>
                    </div>
                    <br/>
                    <br/>
                    <div class="row">
                       <div class="col-md-6">
                         <input nbInput #name placeholder="Name">
                       </div>
                       <div class="col-md-6">
                         <button nbButton class="btn-xsmall btn-success" (click)="pushColumn(name.value,ref)">Add</button>
                        </div>
                    </div>
                </nb-card-body>

            </nb-card>
        </ng-template>

       </nb-tab>
    </nb-tabset>
    </nb-layout-column>
    </nb-layout>
  `,
  styles:[`
  code{
    background: #ebebeb;
    color: #2a2a2a;
    padding: 1rem 1rem;
    display: block;
    font-size: 12px;
  }
  code > p {
    margin: 1px;
  }
    .viewer{
      background: white;
      box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
      padding: 15px;
    }
    
    .close {
      position: absolute;
      top: 5px;
      right: 5px;
      color: black;
      font-size: 34px;
      cursor: pointer;
    }
  `]

})

export class KafkaConsumer {


  streamConsumerService:StreamConsumerService;
  
  constructor(streamConsumerService:StreamConsumerService,
     private readonly userProfileService:UserProfileService,
     private dialogService: NbDialogService){
    this.streamConsumerService = streamConsumerService;
    this.userProfileService.reloadUserProfile();
  }

  columns = this.userProfileService.userColumns
  
  @ViewChild('dialog')
  dialog:TemplateRef<any>

  onTableContextMenu(contextMenuEvent) {
    if (contextMenuEvent.type !== 'body') {
       this.dialogService.open(this.dialog, { context: contextMenuEvent.content.name });
       contextMenuEvent.event.preventDefault();
       contextMenuEvent.event.stopPropagation();
    }
  }

  removeColumn = (column,ref) =>{
   let index = this.columns.indexOf(column)
   this.columns.splice(index, 1);
   this.userProfileService.saveLocalColumns()
   ref.close()
  }

  pushColumn = (column,ref) => {
    this.columns.push(column);
    ref.close()
    this.userProfileService.saveLocalColumns()
  }

  getCellValue = (column,value:string) => {
    if(column == "ALL"){
      if(value.length > 90){
        return value.substring(0,90) + '...'
      }else{
        return value;
      }
    }else{
      return JSON.parse(value)[column];
    }
  }

  getActiveTab = () =>{
    return this.streamConsumerService.activeTab;
  }

  onSelect(connection,{ selected }) {
    this.streamConsumerService.connectionsList[connection].selectedJSON =  JSON.parse(selected[0].message)  
  }


  downloadRows = (consumerObject) => {
    let dataStr =  JSON.stringify(consumerObject.rows);
    let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    let exportFileDefaultName = 'data.json';
    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  getKeys = (object) => {
    return Object.keys(object);
  };

  ifRowsExists = (connection:string) =>{
      return (this.streamConsumerService.connectionsList[connection].viewSource as any).length > 0
  };

  getRowsByConnection = (connection:string) =>{
     return this.streamConsumerService.connectionsList[connection].viewSource
  };

  getTabName = (name)=>{
    return name.split('|').join(" ");
  }

  stopStreaming =(connection:string) => {
    this.streamConsumerService.connectionsList[connection].pause()
  }

  resumeStreaming =(connection:string) => {
    this.streamConsumerService.connectionsList[connection].resume()
  }

  isStreamAlive = (connection:string) => {
   return  this.streamConsumerService.connectionsList[connection].streamAlive
  }

  closeStream = (connection:string) => {
    this.streamConsumerService.connectionsList[connection].delete()
    delete this.streamConsumerService.connectionsList[connection];
    this.streamConsumerService.activeTab = Object.keys(this.streamConsumerService.connectionsList)[0]
  }

  applyFilter = (connection,filter) =>{
    this.streamConsumerService.connectionsList[connection].Filter = filter
  }

  showJson = (data,connection) => {
    this.streamConsumerService.connectionsList[connection].selectedJSON= JSON.parse(data.message)
  }

  clearSelected = (connection) => {
    this.streamConsumerService.connectionsList[connection].selectedJSON  =null;
  }

  downloadObjectAsJson = (connection) => {
    let exportJSONS =this.streamConsumerService.connectionsList[connection].viewSource.map(x=>{
      return x.message
    }).join('\n')

    
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(exportJSONS);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", `${connection}.json`);
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  downloadObjectAsCSV =  (connection) => {
    let exportJSONS =this.streamConsumerService.connectionsList[connection].viewSource.map(x=>{
      return JSON.parse(x.message)
    })
  
    this.exportCSVFile(Papa.unparse(exportJSONS),connection)
  }

  private exportCSVFile = (csv, fileTitle) => {
    var exportedFilenmae = fileTitle + '.csv';

    var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) { // IE 10+
        navigator.msSaveBlob(blob, exportedFilenmae);
    } else {
        var link = document.createElement("a");
        if (link.download !== undefined) { // feature detection
            // Browsers that support HTML5 download attribute
            var url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", exportedFilenmae);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
  }

  tabChanged = (event) =>{
   // debugger;
  }

}
