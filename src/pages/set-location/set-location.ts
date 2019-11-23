import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { Location } from '../../model/location';


@Component({
  selector: 'page-set-location',
  templateUrl: 'set-location.html',
})
export class SetLocationPage {
  location:Location 
  marker:Location;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              private viewCtrl:ViewController,
              private loadingCtrl:LoadingController
            ) {
    this.location = this.navParams.get('location');
    if(this.navParams.get('isSet')) {
      this.marker = this.location;
    }
  }

  onSetMarker(event:any){
    console.log(event);
    this.marker = new Location(event.coords.lat, event.coords.lng);
  }

  OnConfirm(){
    this.viewCtrl.dismiss({location:this.marker});
  }

  OnAbort(){
    this.viewCtrl.dismiss();
  }

}
