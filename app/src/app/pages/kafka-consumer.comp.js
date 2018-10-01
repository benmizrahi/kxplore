"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const ngx_lighttable_1 = require("ngx-lighttable");
let KafkaConsumer = class KafkaConsumer {
    constructor(streamConsumerService, userProfileService) {
        this.userProfileService = userProfileService;
        this.settings = {
            headers: [
                {
                    title: 'Offset',
                    field: 'offset',
                    sortable: {
                        enabled: true,
                        direction: ngx_lighttable_1.NgXLightTableSortableDirectionEnum.desc // exported enum
                    }
                },
                {
                    title: 'Partition',
                    field: 'partition',
                    sortable: {
                        enabled: true,
                        direction: ngx_lighttable_1.NgXLightTableSortableDirectionEnum.desc // exported enum
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
        };
        this.getActiveTab = () => {
            return this.streamConsumerService.activeTab;
        };
        this.downloadRows = (consumerObject) => {
            let dataStr = JSON.stringify(consumerObject.rows);
            let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            let exportFileDefaultName = 'data.json';
            let linkElement = document.createElement('a');
            linkElement.setAttribute('href', dataUri);
            linkElement.setAttribute('download', exportFileDefaultName);
            linkElement.click();
        };
        this.getKeys = (object) => {
            return Object.keys(object);
        };
        this.ifRowsExists = (connection) => {
            return this.streamConsumerService.connectionsList[connection].viewSource.length > 0;
        };
        this.getRowsByConnection = (connection) => {
            return this.streamConsumerService.connectionsList[connection].viewSource;
        };
        this.getTabName = (name) => {
            return name.split('|').join(" ");
        };
        this.stopStreaming = (connection) => {
            this.streamConsumerService.connectionsList[connection].stop();
        };
        this.resumeStreaming = (connection) => {
            this.streamConsumerService.connectionsList[connection].start();
        };
        this.isStreamAlive = (connection) => {
            return this.streamConsumerService.connectionsList[connection].streamAlive;
        };
        this.closeStream = (connection) => {
            this.streamConsumerService.connectionsList[connection].stop();
            delete this.streamConsumerService.connectionsList[connection];
            this.streamConsumerService.activeTab = Object.keys(this.streamConsumerService.connectionsList)[0];
        };
        this.applyFilter = (connection) => {
            this.streamConsumerService.connectionsList[connection].makeFilter();
        };
        this.showJson = (data, connection) => {
            this.streamConsumerService.connectionsList[connection].selectedJSON = JSON.parse(data.message);
        };
        this.clearSelected = (connection) => {
            this.streamConsumerService.connectionsList[connection].selectedJSON = null;
        };
        this.downloadObjectAsJson = (connection) => {
            var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.streamConsumerService.connectionsList[connection].data));
            var downloadAnchorNode = document.createElement('a');
            downloadAnchorNode.setAttribute("href", dataStr);
            downloadAnchorNode.setAttribute("download", `${connection}.json`);
            document.body.appendChild(downloadAnchorNode); // required for firefox
            downloadAnchorNode.click();
            downloadAnchorNode.remove();
        };
        this.downloadObjectAsCSV = (connection) => {
            this.exportCSVFile(null, this.streamConsumerService.connectionsList[connection].data, null);
        };
        this.convertToCSV = (objArray) => {
            var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
            var str = '';
            for (var i = 0; i < array.length; i++) {
                var line = '';
                for (var index in array[i]) {
                    if (line != '')
                        line += ',';
                    line += array[i][index];
                }
                str += line + '\r\n';
            }
            return str;
        };
        this.exportCSVFile = (headers, items, fileTitle) => {
            if (headers) {
                items.unshift(headers);
            }
            // Convert Object to JSON
            var jsonObject = JSON.stringify(items);
            var csv = this.convertToCSV(jsonObject);
            var exportedFilenmae = fileTitle + '.csv' || 'export.csv';
            var blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
            if (navigator.msSaveBlob) { // IE 10+
                navigator.msSaveBlob(blob, exportedFilenmae);
            }
            else {
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
        };
        this.tabChanged = (event) => {
            // debugger;
        };
        this.streamConsumerService = streamConsumerService;
    }
};
KafkaConsumer = __decorate([
    core_1.Component({
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
                    <div class="col-lg-6">      
                     <filter-editor [filter]="streamConsumerService.connectionsList[connection].filterObject"></filter-editor>
                    </div>
                    <div class="col-lg-6">   
                      <div class="stream-controller">
                        <i *ngIf=!isStreamAlive(connection) (click)="resumeStreaming(connection)" class="fa fa-play fa-x3" style="color: green;"></i>
                        <i *ngIf=isStreamAlive(connection) (click)="stopStreaming(connection)" class="fa fa-stop fa-x3" style="color: #9e1414e3;"></i>
                        <i class="fa fa-file-o"  (click)="downloadObjectAsJson(connection)"></i>
                        <i class="fa fa-file-excel-o"  (click)="downloadObjectAsCSV(connection)"></i>
                        <i class="fa fa-close fa-x3" style="color: #232223;" (click)="closeStream(connection)"></i>
                        <div> {{streamConsumerService.connectionsList[connection].counter }} Items</div>
                    </div>
                    </div>
                    <div class="lds-ripple" [ngStyle]="{'right': streamConsumerService.connectionsList[connection].selectedJSON ? '38%' : '6%'}" *ngIf=isStreamAlive(connection)><div></div><div></div></div>
                </div>
           </nb-card-header>
           <nb-card-body>
                <consumer-wait *ngIf="!ifRowsExists(connection)" [title]="''" [showLoading]="true"></consumer-wait>
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
        styles: [`
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
], KafkaConsumer);
exports.KafkaConsumer = KafkaConsumer;
//# sourceMappingURL=kafka-consumer.comp.js.map