import {SocketKafkaService} from "../services/socket-kafka.service";
import * as query from './sqlTokinazer/index';
import { environment } from "../../environments/environment";
declare var moment:Function;

export class ConsumerObject{



  public streamAlive:boolean = false;
  public events:Array<any> = []
  public counter:number = 0
  private consumerid;
  public selectedJSON = null;

  constructor(private socketKafkaService:SocketKafkaService,
              public topic: string,public env:string,private callback:any,private timestamp?:number){
                this.viewSource = []
              }

  makeFilter = () => {  
    this.updateSourceStream()
  }

  start(){
    this.socketKafkaService.emit("start-consumer", {topic:this.topic,env: this.env,timestamp:this.timestamp,filter:this.filterObject.value});
    this.socketKafkaService.fromEvent(`akk-consumer-id-${this.topic}-${this.env}`).subscribe((res:any)=>{
      this.consumerid = res.id
      this.socketKafkaService.fromEvent(`messages-list-${this.topic}-${this.env}`).subscribe((res)=>{
        this.callback(res,this)
      });
      this.streamAlive = true;
    });
    this.socketKafkaService.fromEvent('disconnect').subscribe((res)=>{
      this.streamAlive = false;
    })
    this.socketKafkaService.fromEvent(`discribe-env-results`).subscribe((res)=>{
      console.log(res)
    })
    this.socketKafkaService.emit("discribe-env",{env: this.env});
  }

  stop(){
    this.socketKafkaService.emit("stop-consumer", {topic:this.topic,env: this.env,id:this.consumerid});
    this.streamAlive = false;
  }

  applyFilter = (messages:Array<any>,filter:string) => {
    return  messages.map(x=> {
            let results = query([x.message], filter);
            if(results.length == 0) return null;
            else return { message:results[0],offset:x.offset,partition:x.partition}
    }).filter(x => x !== null);
  }

  private _data:any[] = [];
  viewSource:any[] = []

  set data(objects:any[]){
    this._data.length >= environment.maxMessage ? this.shiftItems(objects.length) : true
    this._data = this._data.concat(objects) //save all data
    this.counter = this.counter  + objects.length;
    if(this.filterObject && this.filterObject.value){
      this.viewSource = this.applyFilter(this._data,this.filterObject.value).map(x => {
          return {offset: x.offset,
          partition : x.partition,
          message: JSON.stringify(x.message) 
        }
      });
      console.log(`this.viewSource: ${this.viewSource.length}`)
      this.counter =  this.viewSource.length
    }else{
      this.viewSource = this._data.map(x => {
       return {offset: x.offset,
              partition : x.partition,
              message: JSON.stringify(x.message) 
        }
      });
      console.log(`this.viewSource: ${this.viewSource.length}`)
    }
  }


  private shiftItems = (n:number) => {
      console.log(`removes ${n} items from data`)
      while(n > 0){
        this._data.shift();
        n--;
        this.counter--;
      }
  }
 
  get data() { 
    return this._data;
  }
  private _filterObject:{value:string} = {value:''}

  get filterObject(){
    return this._filterObject
  }

  set filterObject(obj:{value:string}) {
    this.updateSourceStream()
    this._filterObject = obj
  }

  updateSourceStream = async () => {
    if(this.filterObject && this.filterObject.value){
      this.viewSource = this.applyFilter(this._data,this.filterObject.value).map(x => {
            return {offset: x.offset,
            partition : x.partition,
            message: JSON.stringify(x.message) 
          }
        })
    }else
      this.viewSource = this._data.map(element=> {
        return {partition:element.partition,offset:element.offset,message:JSON.stringify(element.message)}
      });
  }
}
