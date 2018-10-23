import {Component} from '@angular/core';
import {StreamConsumerService} from "../services/stream-consumer.service";
import {NgXLightTableSettings} from 'ngx-lighttable/types/ngx-lighttable-settings.type';
import {NgXLightTableSortableDirectionEnum} from 'ngx-lighttable';
import { UserProfileService } from '../services/user-profile.service';
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
                <nb-card>
                  <nb-card-header>
                  <div class="row">
                    <div class="col-lg-11">      
                      <filter-editor (filterChanged)="applyFilter(connection,$event)"></filter-editor>
                      <code class="instractions">
                          <p>SQL like syntax over you're stream data :</p>
                          <p> To select all type * - to filter spcific fields write filed names with comma between AKA: fieldA,fieldB </p>
                          <p>  To filter based on fields type *where* and you're field filter AKA: filedA where fieldB = 1 (no need for quets in strings)</p>
                          <p>  Combine filters using the following operators : && , || , ~ (like) , > < <= >= , ! , and, or </p>
                          <p>  Any JavaScript Expression can be made with the following pattern : "YOU'RE_EXRESSION($filed_from_json)->RESULT_FIELD_NAME" </p>
                           </code>
                    </div>
                    <div class="stream-controller">
                        <i *ngIf=!isStreamAlive(connection) (click)="resumeStreaming(connection)" class="fa fa-play fa-x3" style="color: green;"></i>
                        <i *ngIf=isStreamAlive(connection) (click)="stopStreaming(connection)" class="fa fa-stop fa-x3" style="color: #9e1414e3;"></i>
                        <i class="fa fa-file-o"  (click)="downloadObjectAsJson(connection)"></i>
                        <i class="fa fa-file-excel-o"  (click)="downloadObjectAsCSV(connection)"></i>
                        <i class="fa fa-close fa-x3" style="color: #232223;" (click)="closeStream(connection)"></i>
                        <div> {{streamConsumerService.connectionsList[connection].counter }} Items</div>
                    </div>
                </div>
           </nb-card-header>
           <nb-card-body>
           <div class="lds-ripple" [ngStyle]="{'right': streamConsumerService.connectionsList[connection].selectedJSON ? '38%' : '5%'}" *ngIf=isStreamAlive(connection)><div></div><div></div></div>
             <consumer-wait *ngIf="!ifRowsExists(connection)" [title]="isStreamAlive(connection) ? 'Waiting For Data...' : 'Stream Lost :('" [showLoading]="isStreamAlive(connection)"></consumer-wait>
                <div class="row" *ngIf="ifRowsExists(connection)" >
                  <div  class="header-clean" [ngClass]="{'col-lg-8': streamConsumerService.connectionsList[connection].selectedJSON,'col-lg-12':!streamConsumerService.connectionsList[connection].selectedJSON}">
                      <ngx-lighttable [settings]="settings" [records]="getRowsByConnection(connection)" (onClickRow)="showJson($event,connection)">
                            <ngx-lighttable-cell [field]="'offset'">
                                <ng-template let-offset>
                                    <strong>{{offset}}</strong>
                                </ng-template>
                            </ngx-lighttable-cell>
                            <ngx-lighttable-cell [field]="'partition'">
                            <ng-template let-partition>
                                <strong>{{partition}}</strong>
                            </ng-template>
                        </ngx-lighttable-cell>
                          <ngx-lighttable-cell [field]="'message'">
                                <ng-template let-message>
                                    <strong>{{message}}</strong>
                                </ng-template>
                            </ngx-lighttable-cell>   
                            </ngx-lighttable> 
                    </div>
                    <div  class="col-lg-4 header-clean" *ngIf="streamConsumerService.connectionsList[connection].selectedJSON">
                        <i class="fa fa-close fa-x3" style="color: #232223;" (click)="clearSelected(connection)"></i>
                        <ngx-json-viewer [json]="streamConsumerService.connectionsList[connection].selectedJSON"></ngx-json-viewer>
                    </div>  
                  </div>
                </nb-card-body>
            </nb-card>
            </div>
           </div>
          </div>
         </div>
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


  settings: NgXLightTableSettings = { 
  headers: 
  [
    {
      title: 'Offset',
      field: 'offset',
      sortable: {
          enabled: true,
          direction: NgXLightTableSortableDirectionEnum.desc // exported enum
      }
      },
      {
      title: 'Partition',
      field: 'partition',
      sortable: {
          enabled: true,
          direction: NgXLightTableSortableDirectionEnum.desc // exported enum
      }
      },
      {
          title: 'JSON',
          field: 'message',
          sortable: {
              enabled: false
          }
      }
    ]
  }

  streamConsumerService:StreamConsumerService;

  constructor(streamConsumerService:StreamConsumerService,
   private readonly userProfileService:UserProfileService){
    this.streamConsumerService = streamConsumerService;
    this.userProfileService.reloadUserProfile();
  }

  getActiveTab = () =>{
    return this.streamConsumerService.activeTab;
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
