import {Component, ChangeDetectorRef, ViewChild, TemplateRef} from '@angular/core';
import {StreamConsumerService} from "../services/stream-consumer.service";
import { UserProfileService } from '../services/user-profile.service';
import { NbDialogService } from '@nebular/theme';
declare var Papa:any

@Component({
  selector: 'kafka-table-obj',
  template: `
  <nb-layout>

  <nb-layout-header class="header-layout" style="padding: 1vh 2rem 3vh !important;">
          <stream-selector style="width: 100%;"></stream-selector> 
  </nb-layout-header>
  <nb-layout-column style="position: relative;">
    <consumer-wait *ngIf="getKeys(streamConsumerService.connectionsList).length == 0" [title]="'No Active Connections'"></consumer-wait>
    
    
    <nb-tabset (changeTab)="tabChanged($event)">
      <nb-tab *ngFor="let connection of getKeys(streamConsumerService.connectionsList)" tabTitle="{{getTabName(connection)}}" [id]="connection" [active]="connection == getActiveTab()"> 
      
                        <ngx-datatable class="material" 
                          [columnMode]="'force'"
                          style="height: calc(100vh - 300px);box-shadow: none;"
                          [rowHeight]="50"
                          [headerHeight]="50"
                          [scrollbarV]="true"
                          [scrollbarH]="false"
                          [columns]="getColumns(connection)"
                          (select)="onSelect(connection,$event)"
                          [selectionType]="'single'"
                          (tableContextmenu)="onTableContextMenu($event)"
                          [rows]="getRowsByConnection(connection)">                            
                          </ngx-datatable>

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

  
  @ViewChild('dialog')
  dialog:TemplateRef<any>

  onTableContextMenu(contextMenuEvent) {
    if (contextMenuEvent.type !== 'body') {
       this.dialogService.open(this.dialog, { context: contextMenuEvent.content.name });
       contextMenuEvent.event.preventDefault();
       contextMenuEvent.event.stopPropagation();
    }
  }

  getCellValue = (column,value:string) => {
    if(column == "*"){
      if(value.length > 200){
        return value.substring(0,200) + '...'
      }else{
        return value;
      }
    }else{
      //return JSON.parse(value)[column];
    }
  }

  getActiveTab = () =>{
    return this.streamConsumerService.activeTab;
  }

  onSelect(connection,{ selected }) {
    //this.streamConsumerService.connectionsList[connection].selectedJSON =  JSON.parse(selected[0].message)  
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

  getColumns = (connection) => {
   return  this.streamConsumerService.connectionsList[connection].selectedColumns
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
