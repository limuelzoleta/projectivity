import { Component} from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';
import { Validators, FormBuilder} from "@angular/forms";
import { AuthProviders, AuthMethods, AngularFire } from "angularfire2";

import { HomePage } from "../home/home";
import { UserRegistration } from "../user-registration/user-registration";


import { PUserAccess } from "../../providers/p-user-access";
import {GooglePlus} from '@ionic-native/google-plus';
import firebase from 'firebase';


@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [PUserAccess, GooglePlus],
})




export class Login {

  email = null;
  password = null;
  errorMessage="";
  loginForm: any;
  // private loginForm: FormGroup;
  private userLogin;
  constructor(private navCtrl: NavController, private navParams: NavParams, private platform: Platform, private formBuilder: FormBuilder, private userAccess: PUserAccess, private googlePlus: GooglePlus, private angfire: AngularFire) {
    if(this.userAccess.isLoggedIn()){
      this.navCtrl.setRoot(HomePage);
    }

    this.loginForm = this.formBuilder.group({
      email: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)
      ])),
      password: this.formBuilder.control('', Validators.required)
    });

  }


  login(loginFormInfo){
    let email = loginFormInfo.email;
    let password = loginFormInfo.password
    this.userAccess.userLogin(email, password).then((result) => {
      let loginResult = result.loginResult;
      console.log(loginResult);
      if(loginResult === "success"){
        this.navCtrl.setRoot(HomePage);
      } else {
        let errorCode = result.errorMessage;
        console.log(errorCode);
        if(errorCode === "auth/user-not-found"){
           this.email="";
           this.password="";
           this.errorMessage = "Invalid Email and Password";
        } else if(errorCode === "auth/wrong-password"){
          this.password="";
          this.errorMessage = "Invalid Password";
        }
      }

    });
    return false;
  }



  googleLogin(){

    // If platform is native mobile
    if(this.platform.is('cordova')){

      this.googlePlus.login({"webClientId": "WEB CLIENT ID"})
        .then((res) => {
          const googleCredentials = firebase.auth.GoogleAuthProvider.credential(res.idToken);
          firebase.auth().signInWithCredential(googleCredentials).then((response)=>{
            let currentuser = firebase.auth().currentUser;

            // console.log(JSON.stringify(currentuser));
            let ifUserExists = this.angfire.database.object(`users/${currentuser.uid}`);
            ifUserExists.subscribe((data) =>{
              if(data.$value === null){
                this.userAccess.addUserRecord(currentuser);
              }
            })

            window.localStorage.setItem('currentuser', JSON.stringify(currentuser.displayName));
            this.navCtrl.setRoot(HomePage);
          }, (err)=>{
            alert("login failed");
          });
    })
      .catch(err => console.error(err));
    }

    // If platform is web
    this.angfire.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    }).then((response)=> {
      console.log(response);


      let currentuser = {
        uid: response.auth.uid,
        email: response.auth.email,
        displayName: response.auth.displayName,
        photoURL: response.auth.photoURL
      };
      let ifUserExists = this.angfire.database.object(`users/${response.auth.uid}`);
      ifUserExists.subscribe((data) =>{
        if(data.$value === null){
          // console.log("newbie");
          this.userAccess.addUserRecord(currentuser);
        }
      })

      window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
      this.navCtrl.setRoot(HomePage);
    }). catch((error)=>{
      console.log(error);
    })
  }

  register(){
    this.navCtrl.push(UserRegistration, {}, {animate: true, animation:'fade', direction: 'forward'});
  }

  clearErrorMessage(){
    this.errorMessage="";
  }




}
