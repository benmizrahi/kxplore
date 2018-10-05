import { Component, Inject, OnInit } from '@angular/core';
import {UserProfileService} from "../services/user-profile.service";
import { NbMenuService, NB_WINDOW } from '@nebular/theme';
import { AuthenticationService } from '../services/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'user-area',
  template: ` <nb-user [name]="userProfileService.userProfile?.displayName" [nbContextMenu]="userMenu"
  nbContextMenuTag="user-menu" [picture]="userProfileService?.userProfile.imageUrl" ></nb-user>`,
  styles:[]
})

export class UserAreaComp implements OnInit {

  userProfileService:UserProfileService;

  constructor(userProfileService:UserProfileService,
    private nbMenuService: NbMenuService, @Inject(NB_WINDOW) private window,
    private authenticationService:AuthenticationService,
    private router: Router){
    this.userProfileService = userProfileService;
  }

  userMenu = [{ title: 'Log out' }];

  ngOnInit() {
    this.nbMenuService.onItemClick()
      .subscribe(click => {
        if(click.item.title != "Log out") return
        this.authenticationService.logout();
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
    });
  }

}
