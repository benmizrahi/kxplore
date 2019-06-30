import { Injectable } from '@angular/core';
import {Router, CanActivate, ActivatedRoute} from '@angular/router';
import {AuthenticationService} from "./authentication.service";

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,private route: ActivatedRoute,private authenticationService:AuthenticationService) { }

  canActivate() {

    if (localStorage.getItem('currentUser')) {
      // logged in so return true
      return true;
    }

    if(location.search) {
      let token = location.search.replace("?", "").split("=")[1]
      if (token) {
        this.authenticationService.setLoginToken(token);
        this.router.navigate(['/login']);
        return true;
      }
    }

    // not logged in so redirect to login page
    this.router.navigate(['/login']);
    return false;
  }
}
