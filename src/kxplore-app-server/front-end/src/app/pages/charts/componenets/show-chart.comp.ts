import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Chart } from '../../../../../../kxplore-app-server/dataModels/chart';
import { StreamConsumerService } from '../../../services/stream-consumer.service';

@Component({
    selector: 'show-chart',
    template: `
            <div class="chart-header">{{chart.chartTitle}}</div>
            <div *ngIf="isStreamsExists()" style="height: 80%" echarts [autoResize]="true" [options]="options"  [merge]="updateOptions" class="demo-chart"></div>
    `,
    styles: [`
        .chart-header{
            text-align: center;
            padding: 2%;
            color: #312e2e;
            text-decoration: underline;
        }

        .edit-box-tools{
            width: 100%;
            height: 2%;
        }
    `]
})
export class ShowChart implements OnInit, OnDestroy  {

    @Input() chart:Chart

    timer: any;
    xAxisData:Array<any> = []
    series = []
    updateOptions: any;
    options:any
    constructor( public readonly streamConsumerService:StreamConsumerService) { 
        this.options =  {
            legend: {
              data: [],
              align: 'left'
            },
            tooltip: {},
            xAxis: {
              data: this.xAxisData,
              silent: false,
              splitLine: {
                show: false
              }
            },
            yAxis: {
            },
            series: [],
            animationEasing: 'elasticOut',
            animationDelayUpdate: function (idx) {
              return idx * 5;
            }
          };
    }

    ngOnInit(): void { 
         this.timer = setInterval(() => {      
            
             if(!this.isStreamsExists()) return;

             let legend = Object.keys(this.streamConsumerService.connectionsList).map(x => x);
            this.xAxisData= []
                Object.keys(this.streamConsumerService.connectionsList).forEach(x =>{
                   this.xAxisData= this.xAxisData.concat(this.buildAxisData(this.streamConsumerService.connectionsList[x].viewSource))
            })
          
            this.series =  Object.keys(this.streamConsumerService.connectionsList).map(x =>{
                    return {
                        name: x,
                        type: this.chart.chartType,
                        data: this.buildAggData(this.streamConsumerService.connectionsList[x].viewSource,this.xAxisData),
                        animationDelay: function (idx) {
                            return idx * 10;
                        }
                    }
            });
            
            this.updateOptions = {
                legend:{
                    data:legend
                },
                xAxis :{
                    data: this.xAxisData
                },
                series:  this.series
            }
         }, this.chart.poolingInterval);
    }

    ngOnDestroy() {
        clearInterval(this.timer);
    }

    buildAxisData(viewSource){
        let valuesFunc = eval("("+this.chart.xAxisFunction+")");
        return valuesFunc(viewSource);
    }
    
    buildAggData(viewSource,axisData){
        let valuesFunc = eval("("+this.chart.yAxisFunction+")");
        return valuesFunc(viewSource,axisData);
    }

    isStreamsExists = () =>{
        return  Object.keys(this.streamConsumerService.connectionsList).length > 0
    }
}
