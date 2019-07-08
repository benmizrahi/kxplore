import { Injectable } from '@angular/core';
import {SocketKafkaService} from "./socket-kafka.service";
import {ConsumerObject} from "../objects/consumer-object";
import { UserProfileService } from './user-profile.service';
import { ConnectionObject } from '../objects/connection-object';
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

  startConnection(connectionObject:ConnectionObject){
   
    this.activeTab = connectionObject.getStreamingKey();

    if(this.isStreamExsits(this.activeTab )){
      return this.connections[this.activeTab ];
    } 
    else{
      this.connections[this.activeTab ] = new ConsumerObject(this.socketKafkaService,connectionObject);
    }
    this.connections[this.activeTab ].connect();
    return this.connections[this.activeTab ];
  }

  isStreamExsits = (streamingKey:string)=>{
    if(this.connections[streamingKey])
      return true;
    return false;
  }

}

