import {SocketKafkaService} from "../services/socket-kafka.service";
import { environment } from "../../environments/environment";
import { ConnectionObject } from "./connection-object";
declare var moment:Function;

export class ConsumerObject{

  public streamAlive:boolean = false;
  public events:Array<any> = []
  public counter:number = 0
  public consumed:number = 0
  public selectedJSON = null;
  public selectedColumns = []

  private _data:any[] = [];
  viewSource:any[] = []

  constructor(
              private socketKafkaService:SocketKafkaService,
              private readonly connectionObject:ConnectionObject){
                this.viewSource = []
              }

  connect(){
    this.socketKafkaService.emit("consumer-connect", {connectionObject:this.connectionObject});
    this.socketKafkaService.fromEvent(`consumer-id-${this.connectionObject.getStreamingKey()}-error`).subscribe((res:any)=>{
      alert(JSON.stringify(res))
      this.streamAlive = false;
   });
    this.socketKafkaService.fromEvent(`akk-consumer-id-${this.connectionObject.getStreamingKey()}`).subscribe((res:any)=>{
      this.connectionObject.job_id = res.id
      this.socketKafkaService.fromEvent(`messages-list-${this.connectionObject.getStreamingKey()}`).subscribe((res:any)=>{
          this.selectedColumns = res.messages.metaColumns[0].columns.map((column)=>{
              if (column['as']) return column['as'];
              if(column['columnid']) return column['columnid']
              if(column['aggregatorid'] && column['expression']) return `${column['aggregatorid']}(${column['expression'].columnid})`
              else "UNKONWN"
            }).map((column)=>{
               if(column == "*"){
                  this.data = res.messages.payload.map((row)=>{
                      return { "*": JSON.stringify(row) }
                  })
                }else{
                  this.data = res.messages.payload
                }
                return  { prop: column }
            })
      });
      this.streamAlive = true;
    });
    this.socketKafkaService.fromEvent('disconnect').subscribe((res)=>{
      this.streamAlive = false;
      this.clearListeners()
    })
  }

  private clearListeners = () => {
    this.socketKafkaService.removeListener(`akk-consumer-id-${this.connectionObject.getStreamingKey()}`)
    this.socketKafkaService.removeListener(`consumer-id-${this.connectionObject.getStreamingKey()}-error`)
    this.socketKafkaService.removeListener(`messages-list-${this.connectionObject.getStreamingKey()}`)
  }

  pause(){
    this.socketKafkaService.emit("pause", {connectionObject:this.connectionObject});
    this.streamAlive = false;
  }
  
  resume(){
    this.socketKafkaService.emit("resume", {connectionObject:this.connectionObject});
    this.streamAlive = true;
  }

  delete(){
    this.socketKafkaService.emit("delete", {connectionObject:this.connectionObject});
    this.streamAlive = false;
  }


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
    this.consumed = this.consumed + objects.length;
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
