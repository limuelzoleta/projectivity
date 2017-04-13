import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProviders, AuthMethods, AngularFire } from "angularfire2";
import firebase from 'firebase';

/**
 * Generated class for the UserRegistration page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-user-registration',
  templateUrl: 'user-registration.html',
})




export class UserRegistration {
email: any;
password: any;
name: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,public angularFire: AngularFire) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserRegistration');
  }


  createUser(){
     this.angularFire.auth.createUser({
        email: "mobile@registration.com",
        password: "123456lkj"
      }).then((response) => {
        console.log("user created!");
        console.log(JSON.stringify(response));
          let uid = response.auth.uid;
        this.addUserDB(uid);


      }).catch((error) => {
        console.log("hasError");
        console.log(JSON.stringify(error));
      })
  }


  addUserDB(uid){
    let users = this.angularFire.database.object('users/' + uid);
    users.set({email: "mobile@registration.com", name: "android"});
    // users.(users, {email: "3test@registration.com", name: "tester"});
    console.log("created");
  }

}

