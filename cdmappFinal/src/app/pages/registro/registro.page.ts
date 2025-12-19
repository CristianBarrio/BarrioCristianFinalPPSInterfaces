import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//import Swal from 'sweetalert2';
import { Router } from '@angular/router';
//import { NgxSpinnerService } from 'ngx-spinner';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController, IonModal, LoadingController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  formularioClientes: FormGroup;
  //foto
  imagePreview: any = '../../../assets/user.png';
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
    private pushService: PushNotificationService,
    private toastController: ToastController
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
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      dni: [
        ,
        [
          Validators.required,
          Validators.min(1000000),
          Validators.max(99999999),
        ],
      ],
      perfil: ['cliente', [Validators.required]],
      estado: ['pendiente', [Validators.required]],
      tieneMesa: [false, [Validators.required]],
      tienePedido: [false, [Validators.required]],
      enEspera: [false, [Validators.required]],
      cargoEncuesta: [false, [Validators.required]],
      esAnonimo: [false, [Validators.required]],
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

  async toast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-toast',
    });
    await toast.present();
  }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
      this.isSupported = result.supported;
    });
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
      esAnonimo: false,
      mesa: '',
    });
    this.imagePreview = '../../../assets/userph.png';
  }

  //Foto
  async nuevaFoto() {
    await this.firebase.tomarFoto().then((resultado) => {
      //console.info(resultado);
      this.imagePreview = resultado.webPath;
      this.firebase.readAsBase64(resultado).then((blob) => {
        this.fotoFile = blob;
        this.formularioClientes.controls['fotoFile'].setValue(blob);
      });
    });
  }

  async scan(): Promise<void> {
    
    let codigo = await BarcodeScanner.scan();
    let dni = codigo.barcodes[0].displayValue.split('@');
    //alert(dni);
    this.formularioClientes.controls['nombre'].setValue(dni[2]);
    this.formularioClientes.controls['apellido'].setValue(dni[1]);
    this.formularioClientes.controls['dni'].setValue(dni[4]);
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
    let nombre = Date.now().toString(),
      carpeta = 'fotosPerfil',
      sufijo = '_fotoPerfil',
      coleccion = 'usuarios';
    await this.showLoading().then(() => {
      this.firebase
        .subirImagenes(tempObj.fotoFile, carpeta, nombre + sufijo)
        .then((uploadResult) => {
          this.firebase.traerImagen(carpeta, nombre + sufijo).then((ruta) => {
            tempObj.foto = ruta;
            delete tempObj.fotoFile;
            this.firebase.guardarEnFirebase(tempObj, coleccion).then(() => {
              this.loadingCtrl.dismiss();
              this.toast("Un administrador debe aceptar su cuenta, recibirá más información por e-mail");
              //this.toast("Un administrador debe aceptar su cuenta.");
              this.router.navigate(['/login']);
              this.pushService.enviarPushRol(
                'Se registró un nuevo usuario',
                `El usuario ${tempObj.nombre} ${tempObj.apellido} se ha registrado con el correo ${tempObj.correo}`,
                'admin'
              );
            });
          });
        });
    });
  }
}
