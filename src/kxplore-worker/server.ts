import { Injectable, Inject } from "@decorators/di";
import { MasterCommunication } from "./comunication/master-comunication";
const uuidv1 = require('uuid/v1');


@Injectable()
export class Server {
    
    constructor(@Inject('global-config') private config: any,
                @Inject(MasterCommunication) masterCommunication:MasterCommunication){
         const uuid = uuidv1();
         masterCommunication.start(uuid)
         
    }
  
}