import { Injectable} from '@angular/core';
import { AuthProviders, AuthMethods, AngularFire } from "angularfire2";
import { Platform } from "ionic-angular";
import {GooglePlus} from '@ionic-native/google-plus';
import 'rxjs/add/operator/map';
import firebase from 'firebase';


/*
  Generated class for the PUserAccess provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
let result;
@Injectable()
export class PUserAccess {


  constructor(private angfire: AngularFire, private googlePlus: GooglePlus, private platform: Platform) {
  }

  // User Login method that accepts email and password
  userLogin(loginEmail, loginPassword): Promise<any>{
    return Promise.resolve(
      this.angfire.auth.login({
        email: loginEmail,
        password: loginPassword
      }, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      }).then((response)=> {
        let currentuser = {
          email: response.auth.email,
          picture: response.auth.photoURL
        };
        window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
        
        return result = {
          loginResult: "success"
        };

      }). catch((error)=>{
        let errorCode = JSON.parse(JSON.stringify(error , ['code'])).code;
        
        return result = {
          loginResult: "failed",
          errorMessage: errorCode
        };

    }));
  }

  addUserRecord(userInfo){
  
    let userInfoSet = {
      email: userInfo.email,
      displayName: userInfo.displayName, 
      dateCreated: firebase.database.ServerValue.TIMESTAMP,
      lastUpdated: firebase.database.ServerValue.TIMESTAMP
    }

    if(userInfo.firstName !== undefined){
      userInfoSet['firstName'] = userInfo.firstName;
    }
    if(userInfo.lastName !== undefined){
      userInfoSet['lastName'] = userInfo.lastName;
    }
    if(userInfo.photoURL !== undefined){
      userInfoSet['photoURL'] = userInfo.photoURL;
    } 
    if(userInfo.gender !== undefined){
      userInfoSet['gender'] = userInfo.gender;
    }
    if(userInfo.dateOfBirth !== undefined){
      userInfoSet['dateOfBirth'] = userInfo.dateOfBirth;
    }
    if(userInfo.country !== undefined){
      userInfoSet['country'] = userInfo.country;
    }
    if(userInfo.country !== undefined && userInfo.state !== undefined){
      userInfoSet['state'] = userInfo.state;
    }
    if(userInfo.address !== undefined){
      userInfoSet['address'] = userInfo.address;
    }
       

    let users = this.angfire.database.object('users/' + userInfo.uid);
    users.set(userInfoSet);
    // users.(users, {email: "3test@registration.com", name: "tester"});
    console.log("created");
  }


  isLoggedIn(){
    if(window.localStorage.getItem('currentuser')){
      return true;
    }
  }


  userLogout(){
     if(this.platform.is('cordova')){
        //user is using it as an app
        this.platform.ready().then(() => {
          // In-App apple solution
          console.log ("In App Logout...");

          firebase.auth().signOut().then(success => {
            console.log ("Logout from Firebase...");
            this.googlePlus.disconnect();
            window.localStorage.removeItem('currentuser');
            console.log ("Logged out from Firebase...");
            // this.navCtrl.setRoot(Login);
          });
        });
      } else {
        //In-browser solution
        window.localStorage.removeItem('currentuser');
        firebase.auth().signOut();
        console.log ("Logged out from Firebase...");
        // this.navCtrl.setRoot(Login);
      }

  }

  hasRecord(email) {
    let hasRecord = firebase.auth().fetchProvidersForEmail(email);
    return hasRecord.then(data => {
        if(data[0] === undefined){
          return {userProv: {
            hasRecord : false
          }};
        } else {
          return {userProv: {
            hasRecord : true,
            provider: data[0]
          }};
        }
    });
  }

}
