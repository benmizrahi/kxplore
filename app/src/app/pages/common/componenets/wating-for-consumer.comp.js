"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let WatingForConsumerComp = class WatingForConsumerComp {
    constructor() {
        this.showLoading = false;
    }
};
__decorate([
    core_1.Input()
], WatingForConsumerComp.prototype, "title", void 0);
__decorate([
    core_1.Input()
], WatingForConsumerComp.prototype, "showLoading", void 0);
WatingForConsumerComp = __decorate([
    core_1.Component({
        selector: 'consumer-wait',
        template: `
    
    <div class="load-wrapp" >
      <div class="load-9">
        <p>{{ title}} </p>
        <div class="spinner" *ngIf="showLoading">
          <div class="bubble-1"></div>
          <div class="bubble-2"></div>
        </div>
      </div>
    </div>
  
  `,
        styles: [`
    .load-2 > p {
      padding: 0 1.25rem;
      font-size: 1.25rem;
      font-weight: 500;
      white-space: nowrap;
      line-height: 2.3;
    }
  `]
    })
], WatingForConsumerComp);
exports.WatingForConsumerComp = WatingForConsumerComp;
//# sourceMappingURL=wating-for-consumer.comp.js.map