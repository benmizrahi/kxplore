import { Injectable } from "@angular/core";
import {Chart} from '../../../../../../kxplore-app-server/dataModels/chart'
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../../environments/environment";

@Injectable()
export class KChartsService {

    constructor(private http: HttpClient){}

    get = () =>{
        return new Promise<Array<Chart>>((resolve, reject) => {
            const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
            this.http
            .get(environment.endpoint + "api/charts/get",{headers: headers})
            .subscribe((response:Array<Chart>) => {
                resolve(response);
            })
        })
    }
}