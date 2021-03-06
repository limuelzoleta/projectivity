import { Component, Renderer2, ElementRef } from '@angular/core';
import { NavController, NavParams, } from 'ionic-angular';
import { AngularFire } from "angularfire2";
import { Validators, FormBuilder, FormGroup} from "@angular/forms";

import { UserRegInfo } from "../../components/user-reg-info/user-reg-info";
import { PUserAccess } from "../../providers/p-user-access";




@Component({
  selector: 'page-user-registration',
  templateUrl: 'user-registration.html',
})

export class UserRegistration {
  email=null;
  password = null;
  confirmPassword = null;
  errorMessage: string;
  signUp: FormGroup;
  emailValidator = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  emailHasRecord = true;
  emailValidating: boolean = false;


  /**
   * Creates an instance of UserRegistration.
   * @param {NavController} navCtrl 
   * @param {NavParams} navParams 
   * @param {AngularFire} angularFire 
   * @param {FormBuilder} formBuilder 
   * @param {PUserAccess} userAccess 
   * @param {ElementRef} elementRef 
   * @param {Renderer2} renderer 
   * 
   * @memberof UserRegistration
   */

  constructor(public navCtrl: NavController,  public navParams: NavParams,public angularFire: AngularFire, private formBuilder : FormBuilder, private userAccess: PUserAccess, public elementRef : ElementRef, public renderer : Renderer2) {

      /**
       * Creates an instance of UserRegistration.
       * Form Validators validates email and password
       * 
       * @memberof UserRegistration
       */
    this.signUp = this.formBuilder.group({
      email: this.formBuilder.control('',  Validators.compose([
        Validators.required,
        Validators.pattern(this.emailValidator)
        
      ])),
      password: this.formBuilder.control('', Validators.compose([Validators.required, Validators.minLength(6) ])),
      confirmPassword: this.formBuilder.control('', Validators.compose([Validators.required, passwordMatch])),
    });
     
  }




  

  /**
   * Function that runs when back button is clicked
   *
   */
  backButtonClick(){
    this.navCtrl.pop({animate:true, animation:'right-to-left', direction:'back'});
  }

  /**
   *Function that checks the database for ducplicate email 
   * 
   * @param {any} email 
   * 
   * 
   */
  checkEmail(email){
    if(this.emailValidator.test(email)){
      this.emailValidating = true;
      let emailInputElement = this.elementRef.nativeElement.querySelector('.email-item .item-inner');
      let emailCheck = this.userAccess.hasRecord(email);
      emailCheck.then(data => {
        if(data.userProv.hasRecord){
          this.errorMessage = ": Email already exist";
          this.emailHasRecord = true;
          this.renderer.addClass(emailInputElement, 'input-error');
          this.emailValidating = false;
        } else {
          this.emailValidating = false;
          this.emailHasRecord = false;
        }
      });
    }
    
  }

  /**
   * Moves to the next screen for adding information
   * 
   * @param {any} signUpValue object that contains email and password information
   * 
   * @memberof UserRegistration
   */
  next(signUpValue){
    this.navCtrl.push(UserRegInfo, signUpValue, {animate:true, animation:'left-to-right', direction: 'forward'});
  }

  /**
   * function that clears error messages
   * 
   * @memberof UserRegistration
   */
  clearErrorMessage(){
    this.errorMessage="";
    let emailInputElement = this.elementRef.nativeElement.querySelector('.email-item .item-inner');
    this.renderer.removeClass(emailInputElement, 'input-error');
  }

}

/**
 * 
 * custom validator function for matching passwords
 * @param {any} confirmPassword 
 * @returns 
 */
function passwordMatch(confirmPassword){

  if(confirmPassword.value !== ""){
    let password = confirmPassword.root.controls.password.value;
    let checkPassword = confirmPassword.value;

    if(password === checkPassword){
      return null;
    } else {
      return {passwordMatch: {match: false}};
    }
  }
}
