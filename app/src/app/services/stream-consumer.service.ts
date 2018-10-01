import { Injectable } from '@angular/core';
import {SocketKafkaService} from "./socket-kafka.service";
import {ConsumerObject} from "../objects/consumer-object";
declare var moment:Function;

@Injectable()
export class StreamConsumerService {
 
  xAxisData = []
  
  constructor(private socketKafkaService:SocketKafkaService) { }

  private connections: { [id: string] : ConsumerObject; } = {};
  tmpFilter:any;
  activeTab:string = ''
  showJSON:Object = null

  get connectionsList (){
    return this.connections;
  }

  startConnection(topic: string,env:string,executers:number,callback:any){
    this.activeTab = topic + "|" + env;
 
    if(this.isStreamExsits(topic,env)){
      return this.connections[topic + "|" + env];
    } 
    else{
      this.connections[topic + "|" + env] = new ConsumerObject(this.socketKafkaService,topic,env,callback);
    }
    this.connections[topic + "|" + env].start();
    //this.chartOptions.legend.data.push(topic + "|" + env);
    return this.connections[topic + "|" + env];
  }

  stopConnection = (topic: string,env:string) => {
    if(this.connections[topic + "|" + env])
      this.connections[topic + "|" + env].stop();
  };

  isStreamExsits = (topic: string,env:string)=>{
    if(this.connections[topic + "|" + env])
      return true;
    return false;
  }

}

