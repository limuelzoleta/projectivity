import { Component } from '@angular/core';
import { Platform, App } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage:any = HomePage;
  
  constructor(public platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, public app: App) { 

    platform.ready().then(() => {
      statusBar.styleDefault();
      splashScreen.hide();
      
      platform.registerBackButtonAction(() =>{
        let nav = this.app.getActiveNav();
        if(nav.canGoBack()){
          nav.pop({animate:true, animation: 'right-to-left', direction:'back'});
        } else {
          this.platform.exitApp();
        }
      })




    });
  }
}

