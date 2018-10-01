import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/map'
import { environment } from '../../environments/environment';

@Injectable()
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  login() {
    location.href= environment.endpoint + "auth/login";
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


