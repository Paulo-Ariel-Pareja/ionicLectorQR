import { Component } from '@angular/core';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { DataLocalService } from '../../services/data-local.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  swipesOpts = {
    allowSlidePrev: false,
    allowSlideNext: false
  };

  constructor(  private barcodeScanner: BarcodeScanner,
                private dataLocal: DataLocalService) { }

  ionViewEnter() {
    // console.log('ionViewEnter');
  }

  ionViewDidLeave() {
    // console.log('ionViewDidLeave');
  }

  ionViewWillEnter() {
    // console.log('ionViewWillEnter');
    this.scan();
  }

  ionViewWillLeave() {
    // console.log('ionViewWillLeave');
  }

  scan() {
    this.barcodeScanner.scan().then(barcodeData => {

      if ( !barcodeData.cancelled ) {
        this.dataLocal.guardarRegistro(barcodeData.format, barcodeData.text);
      }
     }).catch(err => {
         console.log('Error', err);
         // this.dataLocal.guardarRegistro('QRCode', 'https://www.hotmail.com');
         // this.dataLocal.guardarRegistro('QRCode', 'geo:40.66904989945786,-73.87547865351564');
     });
  }
}
