/* eslint-disable @angular-eslint/use-lifecycle-interface */
import { Component, OnInit, Input } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
//import { UserAuthService } from 'src/app/Servicios/user-auth.service';
import { Router } from '@angular/router';
import {
  AlertController,
  LoadingController,
  ToastController,
} from '@ionic/angular';
import { IonActionSheetCustomEvent, OverlayEventDetail } from '@ionic/core';
import { take } from 'rxjs';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';
import { TemasService } from 'src/app/servicios/temas.service';
import { UtilsService } from 'src/app/servicios/utils.service';
//import Swal from 'sweetalert2';
//import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  formulario!: FormGroup;
  colores = ['dark', 'warning', 'danger', 'secondary', 'tertiary', 'light'];
  firebaseErrors: any = {
    'auth/user-not-found': 'El correo ingresado no se encuentra registrado',
    'auth/wrong-password': 'Contraseña incorrecta',
  };

  // temas = ['festivo', 'argentina', 'profesional', 'naif'];
  // temaActual = 'tema-argentina';

  hide: boolean = true;

  showOrHidePassword() {
    this.hide = !this.hide;
  }

  usuariosDePrueba = [
    { id: 1, correo: 'owner@owner.com', clave: '111111' },
    { id: 2, correo: 'maitre@maitre.com', clave: '111111' },
    { id: 3, correo: 'cocinero@cocinero.com', clave: '111111' },
    { id: 4, correo: 'bartender@bartender.com', clave: '111111' },
    { id: 5, correo: 'mozo1@mozo.com', clave: '111111' },
    { id: 6, correo: 'cliente1@cliente.com', clave: '111111' },
  ];

  constructor(
    private fb: FormBuilder,
    private ruteador: Router,
    private firebase: FirebaseService,
    private loadingCtrl: LoadingController,
    private alertController: AlertController,
    private toastController: ToastController,
    private utilsSvc: UtilsService,
    //private temaSvc: TemasService
    private pushSvc: PushNotificationService
  ) {
    this.formulario = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit() {
    this.firebase.onSignOut.subscribe(() => {
      this.formulario.reset();
    });

    // this.temaActual = `tema-${this.temaSvc.getTema().toLowerCase()}`;
    // this.temaSvc.temaActual$.subscribe(tema => {
    //   this.temaActual = `tema-${tema.toLowerCase()}`;
    // });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere por favor...',
      cssClass: 'custom-loading',
    });
    loading.present();
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

  setearCampos($event: any) {
    if ($event.detail.data) {
      this.formulario.controls['email'].setValue($event.detail.data.correo);
      this.formulario.controls['password'].setValue(
        $event.detail.data.password
      );
    }
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

  loguear(usuario: string, password: string) {
    this.showLoading().then(() => {
      this.firebase.login(usuario, password).then((response) => {
        response
          .pipe(take(1))
          .subscribe((data) => {
            if (data[0] != undefined) {
              if (
                data[0]['perfil'] === 'cliente' &&
                data[0]['estado'] !== 'aceptado'
              ) {
                if (data[0]['estado'] === 'pendiente') {
                  this.loadingCtrl.dismiss();
                  this.toast('Su cuenta se encuentra en proceso de aprobación');
                }
                if (data[0]['estado'] === 'rechazado') {
                  this.loadingCtrl.dismiss();
                  this.toast(
                    'Lamenamos informarle que su solicitud fue rechazada'
                  );
                }
              } else {
                localStorage.setItem('user', JSON.stringify(data[0]));
                this.firebase.obsUsuario('usuarios', data[0]['uid']);

                setTimeout(() => {
                  this.formulario.reset({ email: '', password: '' });
                  this.loadingCtrl.dismiss();
                  this.ruteador.navigate(['/home']);
                  this.utilsSvc.play('login');
                }, 3000);
              }
            } else {
              this.loadingCtrl.dismiss();
              this.toast(
                'Revise su usuario y/o contraseña e inténtelo nuevamente'
              );
            }
          });
      });
    });
  }

  onSubmit(f: any) {
    this.loguear(f.email, f.password);
  }

  public actionSheetButtons = [
    {
      text: this.usuariosDePrueba[0].correo,
      data: {
        correo: this.usuariosDePrueba[0].correo,
        password: this.usuariosDePrueba[0].clave,
      },
    },
    {
      text: this.usuariosDePrueba[1].correo,
      data: {
        correo: this.usuariosDePrueba[1].correo,
        password: this.usuariosDePrueba[1].clave,
      },
    },
    {
      text: this.usuariosDePrueba[2].correo,
      data: {
        correo: this.usuariosDePrueba[2].correo,
        password: this.usuariosDePrueba[2].clave,
      },
    },
    {
      text: this.usuariosDePrueba[3].correo,
      data: {
        correo: this.usuariosDePrueba[3].correo,
        password: this.usuariosDePrueba[3].clave,
      },
    },
    {
      text: this.usuariosDePrueba[4].correo,
      data: {
        correo: this.usuariosDePrueba[4].correo,
        password: this.usuariosDePrueba[4].clave,
      },
    },
    {
      text: this.usuariosDePrueba[5].correo,
      data: {
        correo: this.usuariosDePrueba[5].correo,
        password: this.usuariosDePrueba[5].clave,
      },
    },
    {
      text: 'Cancelar',
      role: 'cancel',
    },
  ];

  usuariosRegistrados = [
    {correo: 'owner@owner.com', clave: '111111'},
    {correo: 'maitre@maitre.com', clave: '111111'},
    {correo: 'cocinero@cocinero.com', clave: '111111'},
    {correo: 'bartender@bartender.com', clave: '111111'},
    {correo: 'mozo1@mozo.com', clave: '111111'},
    {correo: 'cliente1@cliente.com', clave: '111111'}
  ];

  autocompletarUsuario(usuario: {correo:string, clave:string}){
    this.utilsSvc.play('usuario');

    this.formulario.patchValue({
      email: usuario.correo,
      password: usuario.clave
    });
  }
}
