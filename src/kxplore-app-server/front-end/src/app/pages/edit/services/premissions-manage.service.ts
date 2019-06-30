import { Injectable } from "@angular/core";
import { IObjectService } from "../../../objects/IObjectService";
import { Premissions } from "../../../objects/premissions";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable()
export class PremissionManage implements IObjectService {

    constructor(private http: HttpClient){ }
    
    get = () =>{
        return new Promise<Array<Premissions>>((resolve, reject) => {
          const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
          this.http
            .get(environment.endpoint + "api/premission/get",{headers: headers})
            .subscribe((response:Array<Premissions>) => {
                resolve(this.buildPremissionFromResponed(response));
            })
        })
    }
    save = (user:Premissions) =>{
        return new Promise<Array<Premissions>>((resolve, reject) => {
            const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
            this.http
            .post(environment.endpoint + "api/premission/save",user,{headers: headers})
            .subscribe(response => {
                resolve(this.buildPremissionFromResponed(response));
            })
        })
    }
    delete = (user:Premissions) =>{
        return new Promise<Array<Premissions>>((resolve, reject) => {
            const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
            this.http
            .post(environment.endpoint + "api/premission/delete",user,{headers: headers})
            .subscribe(response => {
                resolve(this.buildPremissionFromResponed(response));
            })
        })
    }

    private buildPremissionFromResponed = (response) => {
        return response.map(x => {
            let obj = new Premissions();
            obj.id = x.id;
            obj.tId = x.tId;
            obj.envName =  x.envName
            obj.topicName = x.topicName;
            obj.uId = x.uId;
            obj.eId = x.eId;
            obj.email = x.email;
            return obj
        } )
    }
}
