import {SocketKafkaService} from "../services/socket-kafka.service";
import * as query from './sqlTokinazer/index';
import { environment } from "../../environments/environment";
import { UserProfileService } from "../services/user-profile.service";
import { QueryBuilderConfig } from "angular2-query-builder";
declare var moment:Function;

export class ConsumerObject{



  public streamAlive:boolean = false;
  public events:Array<any> = []
  public counter:number = 0
  private consumerid;
  public selectedJSON = null;

  constructor(
              private readonly userProfileService:UserProfileService,
              private socketKafkaService:SocketKafkaService,
              public topic: string,
              public env:string,
              private callback:any,
              private timestamp?:number,
              private isOldest?:boolean){
                this.viewSource = []
              }

  connect(){
    this.socketKafkaService.emit("consumer-connect", {topic:this.topic,env: this.env,isOldest:this.isOldest,timestamp:this.timestamp,filter:this._filter});
    this.socketKafkaService.fromEvent(`consumer-id-${this.topic}-${this.env}-error`).subscribe((res:any)=>{
      alert(JSON.stringify(res))
      this.streamAlive = false;
   });
    this.socketKafkaService.fromEvent(`akk-consumer-id-${this.topic}-${this.env}`).subscribe((res:any)=>{
      this.consumerid = res.id
      this.socketKafkaService.fromEvent(`messages-list-${this.topic}-${this.env}`).subscribe((res)=>{
        this.callback(res,this)
      });
      this.streamAlive = true;
    });
    this.socketKafkaService.fromEvent('disconnect').subscribe((res)=>{
      this.streamAlive = false;
      this.clearListeners()
    })
  }

  private clearListeners = () => {
    this.socketKafkaService.removeListener(`akk-consumer-id-${this.topic}-${this.env}`)
    this.socketKafkaService.removeListener(`consumer-id-${this.topic}-${this.env}-error`)
    this.socketKafkaService.removeListener(`messages-list-${this.topic}-${this.env}`)
  }

  pause(){
    this.socketKafkaService.emit("pause", {topic:this.topic,env: this.env,id:this.consumerid});
    this.streamAlive = false;
  }
  
  resume(){
    this.socketKafkaService.emit("resume", {topic:this.topic,env: this.env,id:this.consumerid});
    this.streamAlive = true;
  }

  delete(){
    this.socketKafkaService.emit("delete", {topic:this.topic,env: this.env,id:this.consumerid});
    this.streamAlive = false;
  }

  // applyFilter = (messages:Array<any>,filter:string) => {
  //   return  messages.map(x=> {
  //           let results = query([x.message], filter);
  //           if(results.length == 0) return null;
  //           else return { message:results[0],offset:x.offset,partition:x.partition}
  //   }).filter(x => x !== null);
  // }

  private _data:any[] = [];
  viewSource:any[] = []

  set data(objects:any[]){
    
    this._data.length >= environment.maxMessage ? this.shiftItems(this._data,objects.length) : true
    this._data = this._data.concat(objects) //save all data for filtering
    if(this._filter){
      let data_filterd = this._data
      this.viewSource = this.viewSource.concat(data_filterd)
      this.viewSource.length >= environment.maxMessage ? this.shiftItems(this.viewSource,data_filterd.length) : true
    }else{
      this.viewSource = this._data.map(y=>{
        return y;
      })
    }
    this.counter = this.viewSource.length
  }


  private shiftItems = (array:Array<any>,n:number) => {
      console.log(`removes ${n} items from data`)
      while(n > 0){
        array.shift();
        n--;
        this.counter--;
      }
      return array
  }

 
  get data() { 
    return this._data;
  }
  private _filter:string = ''

  get Filter(){
    return this._filter
  }

  set Filter(value:string) {
    this._filter = value
    this.updateSourceStream()
  }

  updateSourceStream = async () => {
   // if(this._filter){
    //   this.viewSource = this.applyFilter(this._data,this._filter).map(x => {
    //         return {offset: x.offset,
    //         partition : x.partition,
    //         message: JSON.stringify(x.message) 
    //       }
    //     })
    // }else
      this.viewSource = this._data.map(element=> {
        return {partition:element.partition,offset:element.offset,message:JSON.stringify(element.message)}
     });
      }
    }
