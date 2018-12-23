import { Injectable } from '@angular/core';
import {SocketKafkaService} from "./socket-kafka.service";
import {ConsumerObject} from "../objects/consumer-object";
import { UserProfileService } from './user-profile.service';
declare var moment:Function;

@Injectable()
export class StreamConsumerService {
 
  xAxisData = []
  
  constructor(private socketKafkaService:SocketKafkaService,
    private readonly userProfileService:UserProfileService) { }

  private connections: { [id: string] : ConsumerObject; } = {};
  tmpFilter:any;
  activeTab:string = ''
  showJSON:Object = null

  get connectionsList (){
    return this.connections;
  }

  startConnection(topic: string,env:string,timestamp:number,isOldest:boolean,callback:any){
    this.activeTab = topic + "|" + env;
 
    if(this.isStreamExsits(topic,env)){
      return this.connections[topic + "|" + env];
    } 
    else{
      this.connections[topic + "|" + env] = new ConsumerObject(this.userProfileService,this.socketKafkaService,topic,env,callback,timestamp,isOldest);
    }
    this.connections[topic + "|" + env].connect();
    return this.connections[topic + "|" + env];
  }

  isStreamExsits = (topic: string,env:string)=>{
    if(this.connections[topic + "|" + env])
      return true;
    return false;
  }

}

