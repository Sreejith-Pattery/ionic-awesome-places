import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { AddPlacePage } from '../add-place/add-place';
import { Place } from '../../model/place';
import { PlacesService } from '../../services/places';
import { PlacePage } from '../place/place';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {
  addPlacePage:AddPlacePage;
  places:Place[] = [];

  constructor(public navCtrl: NavController, 
              private placesService:PlacesService,
              private modalCtrl:ModalController
            ) {
  }
  ngOnInit(): void {
    this.placesService.fetchPlaces()
      .then(
        (places:Place[])=>{
          this.places = places;
        }
      );
  }

  OnPlaceAdd(){
    this.navCtrl.push(AddPlacePage);
  }

  ionViewWillEnter(){
    this.places = this.placesService.loadPlaces();
  }

  onOpenPlace(place:Place, index:number){
    this.modalCtrl.create(PlacePage,{place:place, index:index}).present();
  }


}
