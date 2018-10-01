import { Component } from "@angular/core";
import { StreamConsumerService } from "../../../services/stream-consumer.service";
import { ConsumerObject } from "../../../objects/consumer-object";
import { UserProfileService } from "../../../services/user-profile.service";

@Component({
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
    styles:[
        `
        .header-text {
          text-align: center;
          padding-top: 13px;
          font-size: 18px;
        }`
    ]
})
export class StreamSelector{
   
    selectedFilter:any = null;
    selectedTopic:string =  null ;
    selectedEnv:string = null;
    executers:number = 1;
    constructor(private readonly streamConsumerService:StreamConsumerService,
        private readonly userProfileService:UserProfileService){

    }
    startStream = () =>{

        if(this.streamConsumerService.isStreamExsits(this.selectedTopic,this.selectedEnv)){
          //TODO: write someting
          return
        }
    
        this.streamConsumerService.startConnection(this.selectedTopic,this.selectedEnv,this.executers,
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