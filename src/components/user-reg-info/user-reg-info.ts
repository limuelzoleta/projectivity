import { Component, Renderer2, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup} from "@angular/forms";
import { AngularFire } from "angularfire2";

import { PUserAccess } from "../../providers/p-user-access";
import { HomePage } from "../../pages/home/home";


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
  
  countrySelect = true;
  stateSelect = true;

  register: FormGroup;
  email: string;
  password: string;
  firstName: string = "";
  lastName: string = "";
  gender: string;
  birthday: Date;
  address: string = "";
  selectedCountry: string;
  selectedState: string;
  isDisabled: boolean = false;

  nameValidator = /^[a-zA-Z ]+$/;
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

  backButtonClick(){
    this.navCtrl.pop({animate:true, animation:'right-to-left', direction:'back'});
  }

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


  registerSubmit(userInfo){
    this.isDisabled = true;
    let filteredFirstName = this.userAccess.toUpperCaseFirst(userInfo.firstName.trim());
    let filteredLastName = this.userAccess.toUpperCaseFirst(userInfo.lastName.trim());
    let filteredAddress = this.userAccess.toUpperCaseFirst(userInfo.address.trim());
    let displayName = filteredFirstName + " " + filteredLastName;
    let registerInfo = {
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
    let createUser = this.userAccess.createUser(this.email, this.password);
    createUser.then(response => {
      registerInfo['uid'] = response.uid;
      this.userAccess.addUserRecord(registerInfo);
      this.userAccess.userLogin(this.email, this.password).then(response => {
        if(response.loginResult === "success"){
          this.navCtrl.setRoot(HomePage);
        }
      });

    }).catch(error => {
      console.log("failed to register")
    });
  }




}
