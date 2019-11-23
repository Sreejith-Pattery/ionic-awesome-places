import { Component } from '@angular/core';
import {  NavParams, ViewController } from 'ionic-angular';
import { Place } from '../../model/place';
import { PlacesService } from '../../services/places';

@Component({
  selector: 'page-place',
  templateUrl: 'place.html',
})
export class PlacePage {
  place:Place
  index:number
  constructor(public navParams: NavParams,
              private viewCtrl:ViewController,
              private placeService:PlacesService
              ) {
    this.place = this.navParams.get('place');
    this.index = this.navParams.get('number');
  }
  
  onLeave(){
    this.viewCtrl.dismiss();
  }

  onDelete(){
    this.placeService.deletePlace(this.index);
    this.onLeave();
  }

}
