import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from "@ionic-native/keyboard";
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { UserRegistration } from "../pages/user-registration/user-registration";
@Component({
  templateUrl: 'app.html',
  providers: [Keyboard]
})
export class MyApp {
  rootPage:any = HomePage;
  // rootPage:any = UserRegistration;
  

  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public keyboard: Keyboard) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.

      statusBar.styleDefault();
      splashScreen.hide();
      
      if (this.platform.is('cordova')) {
              this.keyboard.disableScroll(true);
      }



    });
  }
}

