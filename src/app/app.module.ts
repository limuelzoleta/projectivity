import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {GooglePlus} from '@ionic-native/google-plus';

import { PUserAccess } from "../providers/p-user-access";

import { AngularFireModule } from "angularfire2";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Login } from "../pages/login/login";
import { UserRegistration } from "../pages/user-registration/user-registration";

import { UserRegInfo } from "../components/user-reg-info/user-reg-info";


// Initialize Firebase
const config = {
  apiKey: "AIzaSyBd9udR4zbs_BlI8MjiGubnCskxp6QCJ3Y",
  authDomain: "projectivittest.firebaseapp.com",
  databaseURL: "https://projectivittest.firebaseio.com",
  projectId: "projectivittest",
  storageBucket: "projectivittest.appspot.com",
  messagingSenderId: "851443240011"
};


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Login,
    UserRegistration,
    UserRegInfo
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(
      MyApp, 
      // {
      //   platforms : {
      //     ios : {
      //       // These options are available in ionic-angular@2.0.0-beta.2 and up.
      //       scrollAssist: false,    // Valid options appear to be [true, false]
      //       autoFocusAssist: false  // Valid options appear to be ['instant', 'delay', false]
      //     }
      //     // http://ionicframework.com/docs/v2/api/config/Config/)
      //   }}
        ),
    AngularFireModule.initializeApp(config),
    
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Login,
    UserRegistration,
    UserRegInfo
  ],
  providers: [
    StatusBar,
    Http,
    SplashScreen,
    PUserAccess,
    GooglePlus,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}