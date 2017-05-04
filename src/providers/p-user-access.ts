import { Injectable} from '@angular/core';
import { AuthProviders, AuthMethods, AngularFire } from "angularfire2";
import { Platform } from "ionic-angular";
import {GooglePlus} from '@ionic-native/google-plus';
import 'rxjs/add/operator/map';
import firebase from 'firebase';


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
          uid: response.auth.uid,
          email: response.auth.email,
          picture: response.auth.photoURL
        };
        window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
        
        return result = {
          loginResult: "success",
          currentUserInfo: currentuser
        };

      }). catch((error)=>{
        let errorCode = JSON.parse(JSON.stringify(error , ['code'])).code;
        
        return result = {
          loginResult: "failed",
          errorMessage: errorCode
        };

    }));
  }
  // Add record to db
  addUserRecord(userInfo){
  
    let userInfoSet = {
      email: userInfo.email,
      displayName: userInfo.displayName, 
      isEmailVerified: false,
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
    if(userInfo.birthday !== undefined){
      userInfoSet['birthday'] = userInfo.birthday;
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
          });
        });
      } else {
        //In-browser solution
        window.localStorage.removeItem('currentuser');
        firebase.auth().signOut();
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


  //Create User OAuth using Email and Password
  createUser(email, password){
     return firebase.auth().createUserWithEmailAndPassword(email, password).then(response => {
      return response;
    }).catch(error => {
      return error.message;
    });
  }


  //In future move to general function
  //Capitalize first letter of each word
  toUpperCaseFirst(input){
    let capitalizedInput = "";
    let separator = input.split(/[ ]+/);
    separator.forEach(element => {
      let eachWord = element.substring(0,1).toUpperCase()+element.substring(1);
      capitalizedInput = capitalizedInput + eachWord + " ";
    });
    return capitalizedInput.trim();
  }

}
