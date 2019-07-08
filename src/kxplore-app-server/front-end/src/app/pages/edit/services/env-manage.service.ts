import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { environment } from "../../../../environments/environment";
import { Environment } from "../../../objects/environment";
import { IObjectService } from "../../../objects/IObjectService";

@Injectable()
export class EnvManagmentService implements IObjectService {

    private envierments:Array<Environment>;
    constructor(private http: HttpClient){}

    get = () =>{
        return new Promise<Array<Environment>>((resolve, reject) => {
          const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
          this.http
            .get(environment.endpoint + "api/envierments/get",{headers: headers})
            .subscribe((response:Array<Environment>) => {
              this.envierments = this.buildEnvsFromResponse(response)
              resolve(this.envierments);
            })
        })
    }

    save = (envierment:Environment) =>{
      return new Promise<Array<Environment>>((resolve, reject) => {
        const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
        this.http
          .post(environment.endpoint + "api/envierments/save",envierment,{headers: headers})
          .subscribe(response => {
            this.envierments = this.buildEnvsFromResponse(response)
            resolve(this.envierments);
          })
      })
    }

    delete = (envierment:Environment) =>{
      return new Promise<Array<Environment>>((resolve, reject) => {
        const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
        this.http
          .post(environment.endpoint + "api/envierments/delete",envierment,{headers: headers})
          .subscribe(response => {
            this.envierments = this.buildEnvsFromResponse(response)
            resolve(this.envierments);
          })
      })
    }

    private buildEnvsFromResponse = (response):Array<Environment> =>{
      return response.map(x => {
        let obj = new Environment();
        obj.id = x.id;
        obj.envName = x.envName;
        obj.props = x.props;
        return obj
    } )
    }
}
