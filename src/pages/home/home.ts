import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Login } from "../login/login";


import { PUserAccess } from "../../providers/p-user-access";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [PUserAccess]
})
export class HomePage {

  /**
   * Creates an instance of HomePage.
   * @param {NavController} navCtrl 
   * @param {Platform} platform 
   * @param {PUserAccess} userAccess 
   * 
   * @memberof HomePage
   */
  constructor(public navCtrl: NavController, public platform: Platform, private userAccess: PUserAccess) {

    if(!this.userAccess.isLoggedIn()){
      console.log("You are not logged in");
      this.navCtrl.setRoot(Login);
    } else {
      console.log("You are not logged in");
      this.navCtrl.setRoot(Login);
    }
  }


  // logout(){
  //   this.userAccess.userLogout();
  // }
}
