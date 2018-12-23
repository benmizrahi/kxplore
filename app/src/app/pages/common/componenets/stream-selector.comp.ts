import { Component } from "@angular/core";
import { StreamConsumerService } from "../../../services/stream-consumer.service";
import { ConsumerObject } from "../../../objects/consumer-object";
import { UserProfileService } from "../../../services/user-profile.service";
declare var moment:Function;

@Component({
    selector: 'stream-selector',
    template: `
         <div class="row" style="width: 100%;">
            <div class="col-lg-4">
            <div class="row"> 
                <div class="col-lg-6 header-text">
                    <span>Environment: </span>
                </div>
                <div class="col-lg-6">
                <select class="form-control"  [(ngModel)]="selectedEnv" >
                    <option *ngFor="let env of getEnvsFromProfile()">{{env}}</option>
                </select>
                </div>
            </div>
            </div>
            <div class="col-lg-2">
                <div class="row"  *ngIf="selectedEnv"> 
                    <div class="col-lg-4 header-text">
                        <span>Topic: </span>
                    </div>
                    <div class="col-lg-6">
                    <select class="form-control"  [(ngModel)]="selectedTopic">
                        <option *ngFor="let topic of getTopicsInEnv(selectedEnv)">{{topic}}</option>
                    </select>
                    </div>
                </div>
            </div>
            <div class="col-lg-1" *ngIf="selectedTopic && selectedEnv">
                <select class="form-control"  [(ngModel)]="from">
                    <option value="1">Newest</option>
                    <option value="2">Oldest</option>
                    <option value="3">DateTime</option>
                </select>
            </div>
            <div class="col-lg-2" *ngIf="selectedTopic && selectedEnv && from == 3">
                <input nbInput class="form-control" [(ngModel)]="selectedDateTime"  placeholder="Form Picker" [nbDatepicker]="formpicker">
                <nb-datepicker #formpicker></nb-datepicker>
            </div>
            <div class="col-lg-2" style="text-align: left;">
                <button *ngIf="selectedTopic && selectedEnv" style="background: #afe0af;" class="btn btn-hero-warning" (click)="startStream()">Pull</button>
            </div>
        </div>
    `,
    styles:[
        `
        .header-text {
            text-align: center;
            padding-top: 8px;
            font-size: 18px;
        }`
    ]
})
export class StreamSelector{
    selectedDate: string;
    selectedFilter:any = null;
    selectedTopic:string =  null ;
    selectedEnv:string = null;
    selectedDateTime: Date;
    from = "1";

    executers:number = 1;
    constructor(private readonly streamConsumerService:StreamConsumerService,
        private readonly userProfileService:UserProfileService){
           
    }
    startStream = () =>{

        if(this.streamConsumerService.isStreamExsits(this.selectedTopic,this.selectedEnv)){
            alert('please delete the connection before reconnect!')
            return;
        }
        
    
        this.streamConsumerService.startConnection(this.selectedTopic,this.selectedEnv,
            this.from  == "3" && this.selectedDateTime  ? moment(this.selectedDateTime).format('x') : null,
            (this.from == "2" ? true : false),
          (res,object:ConsumerObject)=>{
            if(res.topic != object.topic || res.env != object.env) return ;
            object.data = res.messages
          });
      };

  getEnvsFromProfile = () => {
    return Object.keys(this.userProfileService.userProfile.envs);
  }


  getTopicsInEnv = (env)=>{
    return this.userProfileService.userProfile.envs[env]
  }

    }