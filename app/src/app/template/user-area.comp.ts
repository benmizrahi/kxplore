import { Component, Inject, OnInit } from '@angular/core';
import {UserProfileService} from "../services/user-profile.service";
import { NbMenuService, NB_WINDOW } from '@nebular/theme';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user-area',
  template: ` <nb-user style="float: left" [name]="userProfileService.userProfile?.displayName" [picture]="userProfileService?.userProfile.imageUrl" >
    </nb-user>  
    <i class="fa fa-sign-out signout" (click)="logOut()"></i>`,
  styles:[`
    .signout{
      font-size: 29px;
      margin-left: 12px;
      margin-top: 5px;
      
    }
  `]
})

export class UserAreaComp implements OnInit {

  userProfileService:UserProfileService;

  constructor(userProfileService:UserProfileService,
    private nbMenuService: NbMenuService, @Inject(NB_WINDOW) private window,
    private authenticationService:AuthenticationService,
    private router: Router){
    this.userProfileService = userProfileService;
  }
  ngOnInit() {

  }

  logOut = () => {
    this.authenticationService.logout();
    this.router.navigate(['/login']);
  }

}
