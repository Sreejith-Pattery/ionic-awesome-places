import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, ToastController } from 'ionic-angular';
import { NgForm } from '../../../node_modules/@angular/forms';
import { SetLocationPage } from '../set-location/set-location';
import { Location } from '../../model/location';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { PlacesService } from '../../services/places';
import { File, Entry } from '@ionic-native/file';
import { normalizeURL } from 'ionic-angular';

declare var cordova:any;
@Component({
  selector: 'page-add-place',
  templateUrl: 'add-place.html',
})
export class AddPlacePage {
  location:Location = {
    lat:40.7624,
    lng:-73.9759
  }
  locationIsSet:boolean = false;
  imageUrl:string = ''

  constructor(public navCtrl: NavController, 
              private modalCtrl:ModalController,
              private geolocation:Geolocation,
              private loadingCtrl:LoadingController,
              private toastCtrl:ToastController,
              private camera:Camera,
              private placeService:PlacesService,
              private file:File
            ) {
  }

  onLocate(){
    const loader = this.loadingCtrl.create({
      content:'Getting your location'
    });
    loader.present();

    this.geolocation.getCurrentPosition().then(
      location => {
        loader.dismiss();
        this.location.lat = location.coords.latitude;
        this.location.lng = location.coords.longitude;
        this.locationIsSet = true;

        /*
        this.toastCtrl.create({
          message:'location: '+location.coords.latitude+", "+location.coords.longitude,
          duration:1500,
          position:'bottom'
        }).present();*/
      }
    ).catch(
      error=>{
        loader.dismiss();
        const toast = this.toastCtrl.create({
          message:'Could not get location, please pick it manually!',
          duration:2500
        })
      }
    )
  }

  onTakePhoto(){
    const options: CameraOptions = {
      quality: 100,
      correctOrientation:true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options)
    .then(
      (imageData)=>{
        //this.imageUrl = imageData;
        /*
        this.toastCtrl.create({
          message:'imageData:'+imageData,
          duration:5000
        }).present();*/

      var currentName = imageData.replace(/^.*[\\\/]/, '');
      var path = imageData.replace(/[^\/]*$/, '');
      const newFileName = new Date().getUTCMilliseconds()+'.jpg';
      this.file.moveFile(path,currentName,cordova.file.dataDirectory,newFileName)
        .then(
          (data:Entry)=>{
            //const fileUrl = data.nativeURL.replace(/^file:\/\//, '');
            var fileUrl =  normalizeURL(data.nativeURL);
            fileUrl = data.nativeURL.replace(/^file:\/\//, '');
            console.log("file saved to:"+fileUrl);
            this.toastCtrl.create({
              message:"file saved to:"+fileUrl,
              duration:2500,
              position:'top'
            }).present();
            //this.imageUrl =  data.nativeURL;
            this.imageUrl = fileUrl;
            this.camera.cleanup();
          }
        )
        .catch(
          err=>{
            this.imageUrl = '';
            this.toastCtrl.create({
              message:'Could not save the image. Please try again',
              duration:2500
            }).present();
            this.camera.cleanup();
          }
        )
      ;
      this.imageUrl = imageData;
      }
    ).catch(
      error=>{
        console.log(error);
        this.toastCtrl.create({
          message:'Could not take the image',
          duration:5000
        }).present();
      }
    )
  }

  onOpenMap(){
    const modal = this.modalCtrl.create(SetLocationPage, {location: this.location, isSet:this.locationIsSet});
    modal.present();
    modal.onDidDismiss(data=>{
      if(data) {
        this.location = data.location
        this.locationIsSet = true;
      }
    })
  }

  OnSubmit(form:NgForm){
    this.placeService
    .addPlace(form.value.title, form.value.description, this.location, this.imageUrl);
    form.reset();
    this.location = {
      lat:40.7624,
      lng:-73.9759
    },
    this.imageUrl = '',
    this.locationIsSet = false;
  }

}
