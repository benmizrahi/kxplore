"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let KChartsView = class KChartsView {
    constructor(streamConsumerService, userProfileService) {
        this.streamConsumerService = streamConsumerService;
        this.userProfileService = userProfileService;
        this.xAxisData = [];
        this.series = [];
        this.options_drag = [{ "row": 1, "col": 1, "unitx": 2, "resizable": true, "payload": 1 }, { "row": 1, "col": 1, "unitx": 2, "resizable": true, "payload": 1 }, { "row": 1, "col": 1, "unitx": 2, "resizable": true, "payload": 1 }];
        this.containerConfig = {
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
            'widget_width_factor': 22
        };
        this.options = { maxLines: 1000, printMargin: false };
        this.tabChanged = (event) => {
        };
        this.getKeys = (object) => {
            return Object.keys(object);
        };
        this.getTabName = (name) => {
            return name.split('|').join(" ");
        };
        this.getActiveTab = () => {
            return this.streamConsumerService.activeTab;
        };
        this.timer = setInterval(() => {
            let legend = Object.keys(streamConsumerService.connectionsList).map(x => x);
            this.xAxisData = [];
            Object.keys(streamConsumerService.connectionsList).forEach(x => {
                this.xAxisData = this.xAxisData.concat(streamConsumerService.connectionsList[x].XAxisData);
            });
            this.series = Object.keys(streamConsumerService.connectionsList).map(x => {
                return {
                    name: x,
                    type: this.streamConsumerService.connectionsList[x].ChartType,
                    data: streamConsumerService.connectionsList[x].getAggData(this.xAxisData),
                    animationDelay: function (idx) {
                        return idx * 10;
                    }
                };
            });
            this.updateOptions = {
                legend: {
                    data: legend
                },
                xAxis: {
                    type: "category",
                    data: this.xAxisData
                },
                series: this.series
            };
        }, 3000);
    }
    ngOnDestroy() {
        clearInterval(this.timer);
    }
    ngOnInit() {
        // const xAxisData = [];
        // const data1 = [];
        // const data2 = [];
        // for (let i = 0; i < 100; i++) {
        //     xAxisData.push('category' + i);
        //     data1.push((Math.sin(i / 5) * (i / 5 - 10) + i / 6) * 5);
        //     data2.push((Math.cos(i / 5) * (i / 5 - 10) + i / 6) * 5);
        // }
    }
};
__decorate([
    core_1.ViewChild('editor')
], KChartsView.prototype, "editor", void 0);
__decorate([
    core_1.ViewChild('editortwo')
], KChartsView.prototype, "editortwo", void 0);
KChartsView = __decorate([
    core_1.Component({
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
                                <div class="add-chart">
                                    <i class="fa fa-plus-square"></i>
                                </div>
                                <div class="defined-chart" [(ngWidget)]="options_drag[0]" > 
                                    <div style="max-height: 95%;" echarts [options]="streamConsumerService.chartOptions"  [merge]="updateOptions" class="demo-chart"></div>
                                </div>
                            </div>       
                    </div>
                </div>
            </nb-layout-column>
        </nb-layout>
    `,
        styles: [
            `
            .chart-header {
                text-align: center;
            }

            .defined-chart{

            }
        `
        ]
    })
], KChartsView);
exports.KChartsView = KChartsView;
//# sourceMappingURL=kcharts-view.comp.js.map