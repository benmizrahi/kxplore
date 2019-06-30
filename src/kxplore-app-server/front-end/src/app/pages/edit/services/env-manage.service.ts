import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Envierment } from "../../../objects/envierment";
import { IObjectService } from "../../../objects/IObjectService";

@Injectable()
export class EnvManagmentService implements IObjectService {

    private envierments:Array<Envierment>;
    constructor(private http: HttpClient){}

    get = () =>{
        return new Promise<Array<Envierment>>((resolve, reject) => {
          const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
          this.http
            .get(environment.endpoint + "api/envierments/get",{headers: headers})
            .subscribe((response:Array<Envierment>) => {
              this.envierments = this.buildEnvsFromResponse(response)
              resolve(this.envierments);
            })
        })
    }

    save = (envierment:Envierment) =>{
      return new Promise<Array<Envierment>>((resolve, reject) => {
        const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
        this.http
          .post(environment.endpoint + "api/envierments/save",envierment,{headers: headers})
          .subscribe(response => {
            this.envierments = this.buildEnvsFromResponse(response)
            resolve(this.envierments);
          })
      })
    }

    delete = (envierment:Envierment) =>{
      return new Promise<Array<Envierment>>((resolve, reject) => {
        const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
        this.http
          .post(environment.endpoint + "api/envierments/delete",envierment,{headers: headers})
          .subscribe(response => {
            this.envierments = this.buildEnvsFromResponse(response)
            resolve(this.envierments);
          })
      })
    }

    private buildEnvsFromResponse = (response):Array<Envierment> =>{
      return response.map(x => {
        let obj = new Envierment();
        obj.id = x.id;
        obj.envName = x.envName;
        obj.props = x.props;
        return obj
    } )
    }
}
