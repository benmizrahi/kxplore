import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {environment} from "../../environments/environment";

@Injectable()
export class UserProfileService {

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
  }

  userProfile:any;

  getUserProfile = () => {
    if(this.authenticationService.isLogedIn()) {
      return this.loadUser();
    }

    if(location.search) {
      let token = location.search.replace("?", "").split("=")[1]
      if (token) {
        localStorage.setItem("currentUser",token);
        return this.loadUser(token);
      }
    }
  };

  isAdmin = () => {
    if(this.userProfile && this.userProfile.admin == "1") return true
    return false
  }

  loadUser = (token?) =>{
    return new Promise((resolve, reject) => {
      const headers = new HttpHeaders({'authorization':"token " + localStorage.getItem("currentUser")});
      this.http
        .get(environment.endpoint + "profile",{headers: headers})
        .subscribe(response => {
          this.userProfile = response;
          resolve(true);
        })
    })
  }
}

