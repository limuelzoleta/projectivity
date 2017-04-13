import { Component } from '@angular/core';
import { NavController, Platform } from 'ionic-angular';
import { Login } from "../login/login";


import {GooglePlus} from '@ionic-native/google-plus';
import firebase from 'firebase';
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [GooglePlus]
})
export class HomePage {

  constructor(public navCtrl: NavController, public platform: Platform, private googlePlus: GooglePlus) {
    // window.localStorage.removeItem('currentuser');

    if(!this.isLoggedIn()){
      console.log("You are not logged in");
      this.navCtrl.setRoot(Login);
    }
  }

  isLoggedIn(){
    if(window.localStorage.getItem('currentuser')){
      return true;
    }
  }
  logout(){
     if(this.platform.is('cordova')){
        //user is using it as an app
        this.platform.ready().then(() => {
          // In-App apple solution
          console.log ("In App Logout...");

          firebase.auth().signOut().then(success => {
            console.log ("Logout from Firebase...");
            this.googlePlus.disconnect();
            window.localStorage.removeItem('currentuser');
            this.navCtrl.setRoot(Login);
          });
        });
      } else {
        //In-browser solution
        window.localStorage.removeItem('currentuser');
        firebase.auth().signOut();
        this.navCtrl.setRoot(Login);
      }

  }
}
