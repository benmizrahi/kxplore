import {Component, Input, OnInit} from '@angular/core';
import {AuthenticationService} from "../services/authentication.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'login-comp',
  template: `
    <div class="warrper">
      <div class="form">
        <div class="header">Kxplore Login </div>
        <img src="http://www.androidpolice.com/wp-content/themes/ap2/ap_resize/ap_resize.php?src=http%3A%2F%2Fwww.androidpolice.com%2Fwp-content%2Fuploads%2F2015%2F10%2Fnexus2cee_Search-Thumb-150x150.png&w=150&h=150&zc=3">
        <p>Login With Google Account</p>
        <button (click)="login()" >Sign in</button>
        <div class="error-message" *ngIf="error">{{error }} :( </div>
      </div>
    </div>
  `,
  styles:[
    `
      .header {
        color: #000000ab;
        font-size: 37px;
        text-decoration: underline;
      }
      .warrper {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .error-message{
        color: #ff0808;
        font-style: italic;
        padding: 10px;
        line-height: 2;
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

export class LoginPageComp{

  error = null;
  constructor(private  authenticationService:AuthenticationService){ 
    this.error = location.search.indexOf("UnAuthoraized") > -1 ? "UnAuthoraized Exception" :
    location.search.indexOf("error") > -1 ? "Internal Server Error" : ""
   }


  login = ()=>{
    this.authenticationService.login();
  }
}
