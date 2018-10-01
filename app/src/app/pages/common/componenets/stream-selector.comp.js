"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let StreamSelector = class StreamSelector {
    constructor(streamConsumerService, userProfileService) {
        this.streamConsumerService = streamConsumerService;
        this.userProfileService = userProfileService;
        this.selectedFilter = null;
        this.selectedTopic = null;
        this.selectedEnv = null;
        this.executers = 1;
        this.startStream = () => {
            if (this.streamConsumerService.isStreamExsits(this.selectedTopic, this.selectedEnv)) {
                //TODO: write someting
                return;
            }
            this.streamConsumerService.startConnection(this.selectedTopic, this.selectedEnv, this.executers, (res, object) => {
                if (res.topic != object.topic || res.env != object.env)
                    return;
                object.data = res.messages;
            });
        };
        this.getEnvsFromProfile = () => {
            return Object.keys(this.userProfileService.userProfile.envs);
        };
        this.getTopicsInEnv = (env) => {
            return this.userProfileService.userProfile.envs[env];
        };
    }
};
StreamSelector = __decorate([
    core_1.Component({
        selector: 'stream-selector',
        template: `
         <div class="row" style="width: 100%;">
            <div class="col-lg-4">
            <div class="row"> 
                <div class="col-lg-6 header-text">
                <span>Envierment: </span>
                </div>
                <div class="col-lg-6">
                <select class="form-control"  [(ngModel)]="selectedEnv" >
                    <option *ngFor="let env of getEnvsFromProfile()">{{env}}</option>
                </select>
                </div>
            </div>
            </div>
            <div class="col-lg-4">
            <div class="row"  *ngIf="selectedEnv"> 
                <div class="col-lg-6 header-text">
                    <span>Topic: </span>
                </div>
                <div class="col-lg-6">
                    <select class="form-control"  [(ngModel)]="selectedTopic">
                        <option *ngFor="let topic of getTopicsInEnv(selectedEnv)">{{topic}}</option>
                    </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-2" style="text-align: right;">
            <button *ngIf="selectedTopic && selectedEnv" class="btn btn-hero-warning" (click)="startStream()">Pull</button>
            </div>
        </div>
    `,
        styles: [
            `
        .header-text {
          text-align: center;
          padding-top: 13px;
          font-size: 18px;
        }`
        ]
    })
], StreamSelector);
exports.StreamSelector = StreamSelector;
//# sourceMappingURL=stream-selector.comp.js.map