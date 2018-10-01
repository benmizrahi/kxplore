"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
let LoginPageComp = class LoginPageComp {
    constructor(authenticationService) {
        this.authenticationService = authenticationService;
        this.login = () => {
            this.authenticationService.login();
        };
    }
};
LoginPageComp = __decorate([
    core_1.Component({
        selector: 'login-comp',
        template: `
    <div class="warrper">
      <div class="form">
        <img src="http://www.androidpolice.com/wp-content/themes/ap2/ap_resize/ap_resize.php?src=http%3A%2F%2Fwww.androidpolice.com%2Fwp-content%2Fuploads%2F2015%2F10%2Fnexus2cee_Search-Thumb-150x150.png&w=150&h=150&zc=3">
        <p>Login With Google Account</p>
        <button (click)="login()" >Sign in</button>
  
      </div>
    </div>
  `,
        styles: [
            `
      .warrper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      
      * {
        box-sizing: border-box;
      }

      body {
        background-color: #eeeeee;
      }

      img {
        display: block;
        width: 80px;
        margin: 30px auto;
        box-shadow: 0 5px 10px -7px #333333;
        border-radius: 50%;
      }

      .form {
        background-color: #ffffff;
        width: 500px;
        margin: 50px auto 10px auto;
        padding: 30px;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 10px -3px #333;
        text-align: center;
        position: absolute;
        left: 50%;
        top: 38%;
        -webkit-transform: translate(-50%, -50%);
        transform: translate(-50%, -50%);
      }

      input {
        border-radius: 100px;
        padding: 10px 15px;
        width: 50%;
        border: 1px solid #D9D9D9;
        outline: none;
        display: block;
        margin: 20px auto 20px auto;
      }

      button {
        border-radius: 100px;
        border: none;
        background: #719BE6;
        width: 50%;
        padding: 10px;
        color: #FFFFFF;
        margin-top: 25px;
        box-shadow: 0 2px 10px -3px #719BE6;
        display: block;
        margin: 55px auto 10px auto;
      }

      a {
        text-align: center;
        margin-top: 30px;
        color: #719BE6;
        text-decoration: none;
        padding: 5px;
        display: inline-block;
      }

      a:hover {
        text-decoration: underline;
      }


    `
        ]
    })
], LoginPageComp);
exports.LoginPageComp = LoginPageComp;
//# sourceMappingURL=login-page.comp.js.map