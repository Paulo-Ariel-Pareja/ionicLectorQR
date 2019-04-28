import { Injectable } from '@angular/core';
import { Registro } from '../models/registro.model';
import { Storage } from '@ionic/storage';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { File } from '@ionic-native/file/ngx';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Injectable({
  providedIn: 'root'
})
export class DataLocalService {

  guardados: Registro[] = [];

  constructor(  private storage: Storage,
                private navCtrl: NavController,
                private iab: InAppBrowser,
                private file: File,
                private emailComposer: EmailComposer ) {
    /* this.storage.get('registros').then( registro => {
      this.guardados = registro || [];
    }); */
    this.cargarGuardados();
   }

   async cargarGuardados() {
     this.guardados = (await this.storage.get('registros')) || [];
   }

  async guardarRegistro( format: string, text: string) {

    await this.cargarGuardados();
    const nuevoRegistro = new Registro( format, text );
    this.guardados.unshift( nuevoRegistro );
    this.storage.set('registros', this.guardados);

    this.abrirRegistro(nuevoRegistro);
  }

  abrirRegistro( registro: Registro ) {

    this.navCtrl.navigateForward('/tabs/tab2');
    switch ( registro.type ) {
      case 'http':
        this.iab.create(registro.text, '_system');
        break;
      case 'geo':
        this.navCtrl.navigateForward(`/tabs/tab2/mapa/${registro.text}`);
        break;
    }
  }

  enviarCorreo() {
    const arrTemp = [];
    const encabezados = 'Tipo, Formato, Creado en, Texto\n';

    arrTemp.push(encabezados);
    this.guardados.forEach( registro => {
      const linea = `${ registro.type },${ registro.format },${ registro.created },${ registro.text.replace(',', ' ') }\n`;

      arrTemp.push(linea);
    });

    this.crearArchivoFisico(arrTemp.join(''));
  }

  crearArchivoFisico( text: string ) {
    this.file.checkFile( this.file.dataDirectory, 'registros.csv' )
      .then( existe => {
        return this.escribirEnArchivo( text );
      })
      .catch( err => {
        return this.file.createFile( this.file.dataDirectory, 'registros.csv', false )
        .then( creado => {
          this.escribirEnArchivo( text );
        })
        .catch( err2 => {
          console.log('no se pudo crear archivo');
        });
      });
  }

  async escribirEnArchivo( text: string) {
    await this.file.writeExistingFile( this.file.dataDirectory, 'registros.csv', text );
    const archivo = `${this.file.dataDirectory}/registros.csv`;

    const email = {
      to: '',
      // cc: 'erika@mustermann.de',
      // bcc: ['john@doe.com', 'jane@doe.com'],
      attachments: [
        archivo
      ],
      subject: 'Barcode history',
      body: 'Backup barcode - <strong>qrLector</strong>',
      isHtml: true
    };

    // Send a text message using default options
    this.emailComposer.open(email);
  }
}
