import { BrowserModule } from '@angular/platform-browser';
import { HttpModule, Http } from '@angular/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import {GooglePlus} from '@ionic-native/google-plus';

import { PUserAccess } from "../providers/p-user-access";
import { PfirebaseCredentials } from "../providers/con-config";

import { AngularFireModule } from "angularfire2";

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Login } from "../pages/login/login";
import { UserRegistration } from "../pages/user-registration/user-registration";

import { UserRegInfo } from "../components/user-reg-info/user-reg-info";



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
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(PfirebaseCredentials),
    
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
