import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//import { NgxSpinnerService } from 'ngx-spinner';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, IonModal, LoadingController } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';

@Component({
  selector: 'app-registro-anonimo',
  templateUrl: './registro-anonimo.page.html',
  styleUrls: ['./registro-anonimo.page.scss'],
})
export class RegistroAnonimoPage {
  formularioClientes: FormGroup;
  //foto
  imagePreview: any = '../../../assets/userph.png';
  fotoFile: File | null = null;

  isSupported = false;
  barcodes: Barcode[] = [];
  usuario: any;

  public alertButtons = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Yes',
      cssClass: 'alert-button-confirm',
    },
  ];

  constructor(
    private fb: FormBuilder,
    private alertController: AlertController,
    private firebase: FirebaseService,
    private router: Router,
    private loadingCtrl: LoadingController,
    private pushService: PushNotificationService
  ) {
    BarcodeScanner.isGoogleBarcodeScannerModuleAvailable().then((respnse) => {
      if (!respnse.available) {
        BarcodeScanner.installGoogleBarcodeScannerModule().then((respnse) => {
          console.info(respnse);
        });
      }
    });
    this.formularioClientes = this.fb.group({
      nombre: ['', [Validators.required]],
      perfil: ['cliente', [Validators.required]],
      tieneMesa: [false, [Validators.required]],
      tienePedido: [false, [Validators.required]], 
      cargoEncuesta: [false, [Validators.required]], 
      enEspera: [false, [Validators.required]],
      esAnonimo: [true, [Validators.required]],
      mesa: [''],
      foto: ['../../../assets/userph.png', []],
      fotoFile: [null, [Validators.required]],
    });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere por favor...',
      cssClass: 'custom-loading'
    });
    loading.present();
  }

  onSubmit(formulario) {
    this.guardar(formulario);
    this.formularioClientes.reset({
      perfil: 'cliente',
      estado: 'pendiente',
      tieneMesa: false,
      tienePedido: false,
      cargoEncuesta: false,
      enEspera: false,
      mesa: '',
      esAnonimo: true,
    });
    this.imagePreview = '../../../assets/userph.png';
  }

  //Foto
  async nuevaFoto() {
    await this.firebase.tomarFoto().then((resultado) => {
      this.imagePreview = resultado.webPath;
      this.firebase.readAsBase64(resultado).then((blob) => {
        this.fotoFile = blob;
        this.formularioClientes.controls['fotoFile'].setValue(blob);
      });
    });
  }

  async modal(head, mensaje) {
    const alert = await this.alertController.create({
      header: head,
      //subHeader: 'No se pudo realizar la carga.',
      cssClass: 'my-custom-class',
      message: mensaje,
      buttons: ['Cerrar'],
    });
    await alert.present();
  }

  async guardar(formulario: any) {
    let tempObj = formulario;
    tempObj.uid = this.firebase.generateUniqueFirestoreId();
    let nombre = Date.now().toString(),
      carpeta = 'fotosPerfilAnonimos',
      sufijo = '_fotoPerfil',
      coleccion = 'usuariosAnonimos';
    await this.showLoading().then(() => {
      this.firebase
        .subirImagenes(tempObj.fotoFile, carpeta, nombre + sufijo)
        .then((uploadResult) => {
          this.firebase.traerImagen(carpeta, nombre + sufijo).then((ruta) => {
            tempObj.foto = ruta;
            delete tempObj.fotoFile;
            this.firebase.guardarEnFirebaseAnonimo(tempObj).then(() => {
              localStorage.setItem('user', JSON.stringify(tempObj));
              this.firebase.obsUsuario('usuariosAnonimos', tempObj.uid);
              setTimeout(() => {
                this.loadingCtrl.dismiss();
                this.router.navigate(['/home']);
              }, 3000);
            });
          });
        });
    });
  }
}
