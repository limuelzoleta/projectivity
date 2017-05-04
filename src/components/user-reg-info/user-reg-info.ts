
import { Component, Renderer2, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup} from "@angular/forms";
import { AngularFire } from "angularfire2";

import { PUserAccess } from "../../providers/p-user-access";
import { HomePage } from "../../pages/home/home";
import { Login } from './../../pages/login/login';
import firebase from 'firebase';


@Component({
  selector: 'user-reg-info',
  templateUrl: 'user-reg-info.html'
})
export class UserRegInfo {
  text: string;
  countries: any;
  country_items = [];
  state;
  states:any;
  state_items = [];
  counter:any;
  countrySelect = true;
  stateSelect = true;
  
  register: FormGroup;
  email: string;
  password: string;
  uid: string;
  firstName: string = "";
  lastName: string = "";
  gender: string;
  birthday: Date;
  address: string = "";
  selectedCountry: string;
  selectedState: string;
  isDisabled: boolean = false;
  backButtonClicked:boolean = false;
  registerInfo: any;
  nameValidator = /^[a-zA-Z ]+$/;
  registrationFrom: any;

    constructor(public navCtrl: NavController,  public navParams: NavParams, private angfire: AngularFire, private formBuilder : FormBuilder, private renderer: Renderer2, private elementRef: ElementRef, private userAccess: PUserAccess) {
      this.countries = this.angfire.database.object('countries',  { preserveSnapshot: true });
      this.countries.subscribe((data) =>{
         data.forEach(country =>{
           this.country_items.push(country.key);
         })
         this.countrySelect = false;
      });

      // Email and password from sign up page 1
      this.email = navParams.data.email;
      this.password = navParams.data.password;
      this.uid = navParams.data.uid;
      this.registrationFrom = navParams.data.from;
      

      this.register = this.formBuilder.group({
        firstName : this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(this.nameValidator)        
        ])),
        lastName : this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(this.nameValidator)        
        ])),
        gender: this.formBuilder.control('', Validators.required),
        birthday: this.formBuilder.control('', Validators.compose([Validators.required, this.checkAge])),
        address: this.formBuilder.control('', Validators.required),
        selectedCountry: this.formBuilder.control('', Validators.required),
        selectedState: ('')

      });
  }

  /**
   * Function used when the back button is clicked
   * clears the database for avoiding duplicate records
   * @memberof UserRegInfo
   */
  backButtonClick(){
    this.backButtonClicked = true;
    clearInterval(this.counter);
    if(this.registrationFrom == "google_signup"){
      firebase.auth().currentUser.delete().then(()=>{
        let user = this.angfire.database.object('users/' + this.uid);
        user.remove();
        console.log("deleted"); 
      })
      this.navCtrl.pop({animate:true, animation:'right-to-left', direction:'back'});
    } else if(this.registrationFrom != "google_signup" && this.isDisabled){
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then(response => {
        firebase.auth().currentUser.delete().then(()=>{
          let user = this.angfire.database.object('users/' + this.uid);
          user.remove();         
        })
      })
      this.navCtrl.pop({animate:true, animation:'right-to-left', direction:'back'});
    } else {
      this.navCtrl.pop({animate:true, animation:'right-to-left', direction:'back'});
    }
    
  }

  /**
   * Feeds the state select menu according to selected country
   * @param {any} selectedCountry 
   * @memberof UserRegInfo
   */
  stateOptions(selectedCountry){   
    if(typeof(selectedCountry) === "string"){
      this.stateSelect = true;
      this.selectedState = null;
      this.state_items = [];
      this.states = this.angfire.database.object('countries/' + selectedCountry + '/states');
      this.states.subscribe((data) =>{
         data.forEach(state =>{
           this.state_items.push(state);
         });
         this.stateSelect = false;

      });
    }
  }


  /**
   * Custom Validator function to check user's age
   * @param {any} birthday 
   * @returns 
   * 
   * @memberof UserRegInfo
   */
  checkAge(birthday){
    var bday = new Date(birthday.value).getFullYear();
    var currentdate = new Date(Date.now()).getFullYear();
    var total = currentdate.valueOf() - bday.valueOf();
    if(total >= 18){
      return null;
    } else {
      return {checkAge: {
        isValid: false
      }};
    }
  }


  /**
   * Process that will register and record user to the databese
   * @param {Array} userInfo 
   * @memberof UserRegInfo
   */
  registerSubmit(userInfo){
    this.registrationTimeCounter();
    this.isDisabled = true;
    let filteredFirstName = this.userAccess.toUpperCaseFirst(userInfo.firstName.trim());
    let filteredLastName = this.userAccess.toUpperCaseFirst(userInfo.lastName.trim());
    let filteredAddress = this.userAccess.toUpperCaseFirst(userInfo.address.trim());
    let displayName = filteredFirstName + " " + filteredLastName;
    this.registerInfo = {
      email: this.email,
      address: filteredAddress,
      birthday: userInfo.birthday,
      firstName: filteredFirstName,
      lastName: filteredLastName,
      displayName: displayName,
      gender: userInfo.gender,
      country: userInfo.selectedCountry,
      state: userInfo.selectedState
    }

    if(this.registrationFrom == "google_signup"){
      this.registerInfo['uid'] = this.uid;
      this.userAccess.addUserRecord(this.registerInfo);
      this.navCtrl.setRoot(HomePage);
    } else {
      let createUser = this.userAccess.createUser(this.email, this.password);
      createUser.then(response => {
        this.registerInfo['uid'] = response.uid;
        this.uid = response.uid;
        if(response.uid != undefined){
          this.userAccess.addUserRecord(this.registerInfo);
          this.userAccess.userLogin(this.email, this.password).then(response => {
            if(response.loginResult === "success"){
              clearInterval(this.counter);
              this.counter = null;
              this.navCtrl.setRoot(HomePage);
            }
          }).catch(error =>{
            alert("login failed");
          });
        } else {
            firebase.auth().currentUser.delete().then(()=>{
            alert("failed to register");
          });
          
        }
      }).catch(error => {
        console.log("failed to register")
      });
    }
  }

  /**
   * Called for resolving lost of connection or anything that will interfere the registration process
   * @memberof UserRegInfo
   */
  registrationTimeCounter(){
    let maxTimeCount = 2;
    this.counter = setInterval(()=>{
      maxTimeCount--;
      if(this.backButtonClicked){
        alert(this.uid);
        clearInterval(this.counter);
      }
      if(maxTimeCount === 0){
        console.log(this.uid);
        if(this.uid != undefined){
          let ifUserExists = this.angfire.database.object(`users/${this.uid}`);
          ifUserExists.subscribe((data) =>{
            if(data.$value === null){
              this.registerInfo['uid'] = this.uid;
              this.userAccess.addUserRecord(this.registerInfo);
              this.userAccess.userLogin(this.email, this.password).then(response => {
                if(response.loginResult === "success"){
                  clearInterval(this.counter);
                  this.counter = null;
                  this.navCtrl.setRoot(HomePage);
                }
              }).catch(error =>{
                alert("login failed");
              });
            }});
        } else {
          this.userAccess.userLogin(this.email, this.password).then(response => {
            console.log(response.currentUserInfo.uid);
            this.uid = response.currentUserInfo.uid;
            let ifUserExists = this.angfire.database.object(`users/${this.uid}`);
            ifUserExists.subscribe((data) =>{
              if(data.$value === null){
                this.registerInfo['uid'] = this.uid;
                this.userAccess.addUserRecord(this.registerInfo);
                  clearInterval(this.counter);
                  this.counter = null;
                  this.navCtrl.setRoot(HomePage);
              }});
          });
        }
      } else if(maxTimeCount < 0) {
        console.log("failed to register");
        firebase.auth().currentUser.delete().then(()=>{
        let user = this.angfire.database.object('users/' + this.uid);
        user.remove();
        console.log("deleted");
        }).catch(error =>{
            console.log(error);
        });

        this.registerInfo = null;
        this.uid = null;
        this.email = null;
        this.password = null;
        clearInterval(this.counter);
        this.counter = null;
        this.navCtrl.setRoot(HomePage);
      }

    }, 30000);
  }




}
