"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let AppComponent = class AppComponent {
    constructor(sidebarService, authenticationService, userProfileService) {
        this.sidebarService = sidebarService;
        this.authenticationService = authenticationService;
        this.userProfileService = userProfileService;
        this.items = [
            {
                title: 'Kxplore',
                expanded: true,
                children: [
                    {
                        title: "Live",
                        link: "/",
                    },
                    {
                        title: 'Charts',
                        link: "/charts"
                    },
                    {
                        title: 'History',
                        link: "/history"
                    },
                    {
                        title: 'Management',
                        children: [
                            {
                                title: 'Envierments',
                                link: "/envierments",
                            },
                            {
                                title: 'Topics',
                                link: "/topics",
                            },
                            {
                                title: 'Users',
                                link: "/users",
                            },
                            {
                                title: 'Permissions',
                                link: "/userPremissions",
                            },
                        ]
                    }
                ]
            }
        ];
    }
    toggle() {
        this.sidebarService.toggle(false);
        return false;
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'app-root',
        template: `
        <nb-layout>
          <nb-layout-header  *ngIf="authenticationService.isLogedIn()" fixed>
              <div class="header-container left" style="width: 88%;">
                  <div  class="logo-containter">
                      <a class="navigation" (click)="toggle()">
                        <i class="nb-menu"></i>
                      </a>
                      <div class="logo">
                        <img class="kafka-icon" src="assets/kafka.png" />
                        K<span>xplore</span>
                      </div>
                  </div>
              </div>
              <div class="header-container">
                <nb-actions size="medium" class="header-container right-header">
                  <nb-action>
                        <user-area></user-area>
                  </nb-action>
              </nb-actions>
              </div>
          </nb-layout-header>
          <nb-sidebar *ngIf="userProfileService.isAdmin()" >
            <nb-menu [items]="items">
            </nb-menu>
          </nb-sidebar>
          <nb-layout-column>
            <router-outlet></router-outlet>
          </nb-layout-column>
        </nb-layout>
  `,
        styles: [`
    .header-clean {
      margin: 0;
      padding: 0;
    }
    .logo-containter {
      font-weight: 600;
      padding: 0 1.25rem;
      font-size: 1.35rem;
      white-space: nowrap;
     }
     .navigation {
      padding-right: 1.25rem;
      font-size: 2.5rem;
      text-decoration: none;
      float: left;
     }
     .logo{
      padding-top: 9px;
     }
     .kafka-icon{
      width: 20px;
     }
  `]
    })
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.comp.js.map