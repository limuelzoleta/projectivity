import { Component, Renderer2, ElementRef } from '@angular/core';

import { NavController, NavParams, Platform } from 'ionic-angular';
import { AuthProviders, AuthMethods, AngularFire } from "angularfire2";
import { HomePage } from "../home/home";

import {GooglePlus} from '@ionic-native/google-plus';
import firebase from 'firebase';

/**
 * Generated class for the Login page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [GooglePlus]

})





export class Login {

  email: any;
  password: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public angfire: AngularFire, public platform: Platform, private googlePlus: GooglePlus, private elementRef: ElementRef, private renderer: Renderer2) {
    if(this.isLoggedIn()){
      this.navCtrl.setRoot(HomePage);
    }

  }


  login(){
    let emailErrorMsg ="";
    let passwordErrorMsg ="";
    let hasError = false;

    // let emailElement = this.elementRef.nativeElement.querySelector('#emailErrorMsg');
    // let emailInputElement = this.elementRef.nativeElement.querySelector('.email-item .item-inner');
    // let passwordElement = this.elementRef.nativeElement.querySelector('#passwordErrorMsg');
    // let passwordInputElement = this.elementRef.nativeElement.querySelector('.pass-item .item-inner');
    // let errorElement = this.elementRef.nativeElement.querySelector('.error-message');



    // this.renderer.setProperty(emailElement, 'innerHTML',  '');
    // this.renderer.removeClass(emailInputElement, 'input-error');

    // this.renderer.setProperty(passwordElement, 'innerHTML',  '');
    // this.renderer.removeClass(passwordInputElement, 'input-error');

    // this.renderer.setProperty(errorElement, 'innerHTML',  '');

    if(this.email === undefined){
      emailErrorMsg = "(Email is required)";
      hasError = true;
    } else if(this.email.trim() === null || this.email.trim() === '' ) {
      emailErrorMsg = "(Email is required)";  
      hasError = true;
    } else if (!this.isValidEmail(this.email)) {
      emailErrorMsg = "(Email is invalid)";    
      hasError = true;
    } else if(this.password === undefined || this.password === null || this.password === ''){
      passwordErrorMsg ="(Invalid password)";
      hasError = true;
    }


    if(hasError){
      if(emailErrorMsg !== ""){
        
        // emailElement.innerHTML("has error");
        this.renderer.setProperty(emailElement, 'innerHTML',  emailErrorMsg);
        this.renderer.addClass(emailInputElement, 'input-error');
        // this.renderer.removeClass(emailInputElement, 'item-inner');
      }
      
      if(passwordErrorMsg !== ""){
        
        // emailElement.innerHTML("has error");
        this.renderer.setProperty(passwordElement, 'innerHTML',  passwordErrorMsg);
        this.renderer.addClass(passwordInputElement, 'input-error');
        // this.renderer.removeClass(emailInputElement, 'item-inner');
      }

      return false;
    } else {

      this.angfire.auth.login({
        email: this.email,
        password: this.password
      }, {
        provider: AuthProviders.Password,
        method: AuthMethods.Password
      }).then((response)=> {
        // console.log("Login success" + JSON.stringify(response));
        let currentuser = {
          email: response.auth.email,
          picture: response.auth.photoURL

        };
        window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
        this.navCtrl.setRoot(HomePage);
      }). catch((error)=>{
        let errorCode = JSON.parse(JSON.stringify(error , ['code'])).code;
        // console.log(errorCode);
        if(errorCode === "auth/user-not-found"){
           this.email="";
           this.password="";
           this.renderer.setProperty(errorElement, 'innerHTML',  'Invalid Email and Password');
        } else if(errorCode === "auth/wrong-password"){
          this.password="";
          this.renderer.setProperty(errorElement, 'innerHTML',  'Invalid Password');
        }

      })
    }
  }



  googleLogin(){
    if(this.platform.is('cordova')){

      this.googlePlus.login({"webClientId": "851443240011-fkbg6qsqbq4e3v4okknrm3atjmvv5mvi.apps.googleusercontent.com"})
      .then((res) => {

        const googleCredentials = firebase.auth.GoogleAuthProvider.credential(res.idToken);
        console.log(googleCredentials);
        console.log("stopper");

        firebase.auth().signInWithCredential(googleCredentials).then((response)=>{
          let currentuser = firebase.auth().currentUser;

          window.localStorage.setItem('currentuser', JSON.stringify(currentuser.displayName));
          this.navCtrl.setRoot(HomePage);
        }, (err)=>{
          alert("login failed");
        });

      
    })
      .catch(err => console.error(err));
    }


    this.angfire.auth.login({
      provider: AuthProviders.Google,
      method: AuthMethods.Popup
    }).then((response)=> {
      // console.log("Login success with Google" + JSON.stringify(response));
      let currentuser = {
        email: response.auth.displayName,
        picture: response.auth.photoURL

      };
      console.log(response.auth.uid);
      let ifUserExists = this.angfire.database.object(`users/${response.auth.uid}`);
      ifUserExists.subscribe((data) =>{
        if(data.$value !== null){
          console.log("user has records");
        } else {
          console.log("newbie");
        }
      })

      window.localStorage.setItem('currentuser', JSON.stringify(currentuser));
      this.navCtrl.setRoot(HomePage);
    }). catch((error)=>{
      console.log(error);
    })
  }


  isLoggedIn(){
    if(window.localStorage.getItem('currentuser')){
      return true;
    }
  }

  isValidEmail(email){
      let regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
      return regex.test(email);

  }

  checkEmail(){
    if(this.email === undefined){
      return false;
    }

    let emailElement = this.elementRef.nativeElement.querySelector('#emailErrorMsg');
    let emailInputElement = this.elementRef.nativeElement.querySelector('.email-item .item-inner');

    this.renderer.setProperty(emailElement, 'innerHTML',  '');
    this.renderer.removeClass(emailInputElement, 'input-error');


    if(this.email.trim() === '' || this.email === undefined){

      this.renderer.setProperty(emailElement, 'innerHTML',  "Email is required");
      this.renderer.addClass(emailInputElement, 'input-error');
    } else if(!this.isValidEmail(this.email)){


      this.renderer.setProperty(emailElement, 'innerHTML',  "Invalid Email");
      this.renderer.addClass(emailInputElement, 'input-error');
    }
  }

  clearInput(type){
    if(type === "email"){
      
      let emailElement = this.elementRef.nativeElement.querySelector('#emailErrorMsg');
      let emailInputElement = this.elementRef.nativeElement.querySelector('.email-item .item-inner');

      this.renderer.setProperty(emailElement, 'innerHTML',  '');
      this.renderer.removeClass(emailInputElement, 'input-error');
    }
  
    if(type === "password"){
      let passwordElement = this.elementRef.nativeElement.querySelector('#passwordErrorMsg');
      let passwordInputElement = this.elementRef.nativeElement.querySelector('.pass-item .item-inner');

      this.renderer.setProperty(passwordElement, 'innerHTML',  '');
      this.renderer.removeClass(passwordInputElement, 'input-error');
    }
  }



}
