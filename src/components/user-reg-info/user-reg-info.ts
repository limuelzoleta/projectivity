import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AuthProviders, AuthMethods, AngularFire } from "angularfire2";

@Component({
  selector: 'user-reg-info',
  templateUrl: 'user-reg-info.html'
})
export class UserRegInfo {
  // @Input() country_items;
  text: string;
  countries: any;
  country_items = [];
  state;

  states:any;
  state_items = [];
  
  countrySelect = true;
  stateSelect = true;
    constructor(public navCtrl: NavController,  public navParams: NavParams, private angfire: AngularFire) {
      this.countries = this.angfire.database.object('countries',  { preserveSnapshot: true });
      this.countries.subscribe((data) =>{
          // console.log(data.key);
         data.forEach(country =>{
           this.country_items.push(country.key);
         })
         this.countrySelect = false;
      });
  }

  backButtonClick(){
    this.navCtrl.pop({animate:true, animation:'right-to-left', direction:'back'});
  }

  stateOptions(selectedCountry){
    
    if(typeof(selectedCountry) === "string"){
      this.stateSelect = true;
      this.state = null;
      this.state_items = [];
      this.states = this.angfire.database.object('countries/' + selectedCountry + '/states');
      this.states.subscribe((data) =>{
          // console.log(data)
         data.forEach(state =>{
          //  console.log(state);
           this.state_items.push(state);
         });
         this.stateSelect = false;

      });
    }
  }

}
