import { Injectable } from "@angular/core";
import { IObjectService } from "../../../objects/IObjectService";
import { environment } from "../../../../environments/environment";
import { HttpHeaders, HttpClient } from "@angular/common/http";
import { User } from "../../../objects/user";


@Injectable()
export class  UsersManageService implements IObjectService {

    constructor(private http: HttpClient){ }

    get = () =>{
        return new Promise<Array<User>>((resolve, reject) => {
          const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
          this.http
            .get(environment.endpoint + "api/user/get",{headers: headers})
            .subscribe((response:Array<User>) => {
              resolve(this.buildUsersFromResponse(response));
            })
        })
      }

    save = (user:User) =>{
    return new Promise<Array<User>>((resolve, reject) => {
        const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
        this.http
        .post(environment.endpoint + "api/user/save",user,{headers: headers})
        .subscribe(response => {
            resolve(this.buildUsersFromResponse(response));
        })
    })
    }

    delete = (user:User) =>{
    return new Promise<Array<User>>((resolve, reject) => {
        const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
        this.http
        .post(environment.endpoint + "api/user/delete",user,{headers: headers})
        .subscribe(response => {
            resolve(this.buildUsersFromResponse(response));
        })
    })
    }

    private buildUsersFromResponse =(response) =>{
        return response.map(x => {
            let obj = new User();
            obj.email = x.email;
            obj.id = x.id
            obj.isAdmin = x.isAdmin;
            return obj
        } )
    }
}