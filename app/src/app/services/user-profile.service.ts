import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthenticationService} from "./authentication.service";
import {environment} from "../../environments/environment";

@Injectable()
export class UserProfileService {

  userColumns = []

  constructor(private http: HttpClient, private authenticationService: AuthenticationService) {
    let columns = localStorage.getItem("user-columns")
    if(columns){
      this.userColumns = (JSON.parse(columns) as string[]);
    }else{
      this.userColumns = ["ALL"]
    }
  }

  saveLocalColumns = () => {
    localStorage.setItem("user-columns",JSON.stringify(this.userColumns));
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

  reloadUserProfile = async () =>{
    let results =  await  this.loadUser()
  }

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
        },(err)=>{
          this.authenticationService.logout();
          location.reload(true);
        })
        
        
    })
  }
}

