import { Component } from "@angular/core";
import { StreamConsumerService } from "../../../services/stream-consumer.service";
import { UserProfileService } from "../../../services/user-profile.service";
import { ConnectionObject } from "../../../objects/connection-object";
declare var moment:Function;

@Component({
    selector: 'stream-selector',
    template: `
         <div class="row" style="width: 100%; height: 53px;">
            <div class="col-lg-2">
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
            <div class="col-lg-2" *ngIf="selectedEnv"> 
                <div class="row"> 
                    <div class="col-lg-6 header-text">
                        <span>Type: </span>
                    </div>
                    <div class="col-lg-6">
                    <select class="form-control"  [(ngModel)]="selectedType" >
                        <option value="Kafka">Kafka</option>
                    </select>
                    </div>
                </div>
            </div>
           
            <div class="col-lg-2">
                <div class="row"  *ngIf="selectedEnv && selectedType"> 
                    <div class="col-lg-4 header-text">
                        <span>Topic: </span>
                    </div>
                    <div class="col-lg-8">
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
            <div class="col-lg-12" style="height: 2.75rem;overflow: hidden;">
                <ngx-monaco-editor [options]="editorOptions" [(ngModel)]="query"></ngx-monaco-editor>
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
    selectedStrategy:string = "PUSH_FILTER";
    selectedType:string = null;
    from = "1";

    editorOptions = {theme: 'vs', language: 'sql',lineNumbers:true,automaticLayout: true,minimap: {
		enabled: false
     }};
     
     private _query:string = `select *  from ?`
     
     public get query() : string {
         return this._query
     }

    public set query(query : string) {
        this._query = query;
    }
    

    executers:number = 1;
    constructor(private readonly streamConsumerService:StreamConsumerService,
        private readonly userProfileService:UserProfileService){}

    startStream = () =>{

        let connectionObject = new ConnectionObject()
        connectionObject.topic = this.selectedTopic
        connectionObject.env = this.selectedEnv
        connectionObject.timestamp = this.from  == "3" && this.selectedDateTime  ? moment(this.selectedDateTime).format('x') : null;
        connectionObject.isOldest = (this.from == "2" ? true : false)
        connectionObject.strategy  = this.selectedStrategy
        connectionObject.query = this._query;
        connectionObject.type  = this.selectedType;

        if(this.streamConsumerService.isStreamExsits(connectionObject.getStreamingKey())){
            alert('please delete the connection before reconnect!')
            return;
        }
        
        this.streamConsumerService.startConnection(connectionObject);
    };

  getEnvsFromProfile = () => {
    return Object.keys(this.userProfileService.userProfile.envs);
  }


  getTopicsInEnv = (env)=>{
    return this.userProfileService.userProfile.envs[env]
  }

}