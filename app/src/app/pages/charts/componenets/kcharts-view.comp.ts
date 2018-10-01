import { Component, OnInit} from "@angular/core";
import { StreamConsumerService } from "../../../services/stream-consumer.service";
import { UserProfileService } from "../../../services/user-profile.service";
import { KChartsService } from "../services/kcharts.service";
import { Chart } from "../../../../../../dataModels/chart";

@Component({
    selector: 'kcharts-view',
    template: `
        <nb-layout>
             <nb-layout-header style="padding: 0 0rem 0.75rem !important;">
                <stream-selector  style="width: 100%;"></stream-selector>
            </nb-layout-header>
            <nb-layout-column style="position: relative;">
                    <div class="row">
                        <div class="col-lg-12">
                           <div [ngWidgetContainer]="containerConfig">                       
                                <div *ngFor="let chart of charts" class="defined-chart" [(ngWidget)]="chart.options_drag" > 
                                    <show-chart [chart]=chart></show-chart>
                                </div>
                            </div>         
                    </div>
                </div>
            </nb-layout-column>
        </nb-layout>
    `,
    styles:[
        `
            .tool-box-charts{

            }
            .chart-header {
                text-align: center;
            }

            .defined-chart{

            }
        `
    ]
  })

export class KChartsView implements OnInit  {
  

    charts:Array<Chart> = []

    containerConfig = {
        'margins': [1],
        'draggable': true,
        'resizable': true,
        'max_cols': 0,
        'max_rows': 0,
        'visible_cols': 4,
        'visible_rows': 4,
        'min_cols': 4,
        'min_rows': 4,
        'col_width': 2,
        'row_height': 2,
        'cascade': 'left',
        'min_width': 100,
        'min_height': 100,
        'fix_to_grid': false,
        'auto_style': true,
        'auto_resize': false,
        'maintain_ratio': false,
        'prefer_new': false,
        'zoom_on_drag': false,
        'limit_to_screen': false,
        'allow_overlap': false,
        'widget_width_factor': 22};

    options:any = {maxLines: 1000, printMargin: false};

    constructor( public readonly streamConsumerService:StreamConsumerService,
        public readonly userProfileService:UserProfileService,
        public readonly kChartsService:KChartsService){  }

    ngOnInit() {    
        this.kChartsService.get().then(charts=>{
            this.charts = charts.map(x=>{
                x.options_drag = JSON.parse(x.options_drag)
                return x;
            });
        })
    }
    
    tabChanged = (event) =>{
        
    }

    getKeys = (object) => {
        return Object.keys(object);
    };

    getTabName = (name)=>{
        return name.split('|').join(" ");
    }

    getActiveTab = () =>{
       return this.streamConsumerService.activeTab;
    }

}