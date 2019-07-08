import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Environment } from "../../../objects/environment";
import { IObjectService } from "../../../objects/IObjectService";
import { Topic } from "../../../objects/topic";
import { EnvManagmentService } from "./env-manage.service";

@Injectable()
export class  TopicManageService implements IObjectService {

    
    constructor(private http: HttpClient,private manageEnv:EnvManagmentService){
    }

      get = () =>{
        return new Promise<Array<Topic>>((resolve, reject) => {
          const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
          this.http
            .get(environment.endpoint + "api/topics/get",{headers: headers})
            .subscribe((response:Array<Topic>) => {
              resolve(this.buildTopicFromResponse(response));
            })
        })
      }

      save = (envierment:Topic) =>{
        return new Promise<Array<Topic>>((resolve, reject) => {
          const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
          this.http
            .post(environment.endpoint + "api/topics/save",envierment,{headers: headers})
            .subscribe(response => {
              resolve(this.buildTopicFromResponse(response));
            })
        })
      }

      delete = (envierment:Topic) =>{
        return new Promise<Array<Topic>>((resolve, reject) => {
          const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
          this.http
            .post(environment.endpoint + "api/topics/delete",envierment,{headers: headers})
            .subscribe(response => {
              resolve(this.buildTopicFromResponse(response));
            })
        })
      }


      private buildTopicFromResponse = (response) =>{
       return response.map(x => {
          let obj = new Topic();
          obj.id = x.id;
          obj.envId = x.envId;
          obj.envName =  x.envName
          obj.topicName = x.topicName;
          return obj
      } )
    }

}
