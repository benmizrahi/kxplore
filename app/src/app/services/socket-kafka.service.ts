import { Injectable, NgModule } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import {AuthenticationService} from "./authentication.service";
import {environment} from "../../environments/environment";

@Injectable()
export class SocketKafkaService extends Socket {

  constructor(private authenticationService:AuthenticationService) {
    super({ url: environment.endpoint +'?token=' + localStorage.getItem("currentUser"), options: {} });
  }

}




