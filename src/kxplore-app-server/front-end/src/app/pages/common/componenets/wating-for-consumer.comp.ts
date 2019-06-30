import {Component, Input} from '@angular/core';

@Component({
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
  styles:[`
    .load-2 > p {
      padding: 0 1.25rem;
      font-size: 1.25rem;
      font-weight: 500;
      white-space: nowrap;
      line-height: 2.3;
    }
  `]
})

export class WatingForConsumerComp {

  @Input() title:string;
  @Input() showLoading:boolean = false;

}
