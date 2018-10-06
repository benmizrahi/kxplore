import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  login() {
    location.href= environment.endpoint + "auth/login";
  }

  signIn = (user,pass) =>{
    return new Promise((resolve, reject) => {
      this.http
        .post(environment.endpoint + "auth/signin",{email:user,password:pass})
        .subscribe(response => {
          debugger;
          resolve(response);
        })
    })
  }

  isLogedIn = () =>{
    return localStorage.getItem("currentUser") != null
   };

  setLoginToken = (token) => {
    localStorage.setItem("currentUser",token)
  };

  logout(): void {
    localStorage.removeItem('currentUser');
  }
}


