/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  Component,
  Input,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { Router } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { distinct, distinctUntilChanged } from 'rxjs';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { ModalController, NavParams } from '@ionic/angular';
import { Timestamp } from 'firebase/firestore';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';
import { serverTimestamp } from 'firebase/firestore';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit {
  @ViewChild('content', { static: false }) content: any;
  arrayMensajes: any[] = [];
  mensaje = '';
  intervalo: any;

  usuarioActual = this.navParams.get('usuarioActual');

  constructor(
    private firebase: FirebaseService,
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private pushService: PushNotificationService
  ) {}

  scrollToBottom() {
    this.content.scrollToBottom(0);
  }

  ngOnInit(): void {
    this.generarChat();
  }

  generarChat() {
    this.firebase
      .traerTodosLosMensajes()
      .pipe(distinctUntilChanged())
      .subscribe((data) => {
        //console.info('nuevo mensaje');
        this.arrayMensajes = data;
        setTimeout(() => {
          this.content.scrollToBottom(0);
        }, 1000);
      });
  }

  esMiMensaje(mensaje: any) {
    console.info('El id del msj: ', mensaje.userUID);
    console.info('El id mio: ', this.usuarioActual.uid);
    if (mensaje.userUID == this.usuarioActual.uid) return true;
    else return false;
  }

  // enviarMensaje() {
  //   let elemento: any = {};
  //   elemento = {
  //     mensaje: this.mensaje,
  //     userUID: this.usuarioActual.uid,
  //     fecha: Timestamp.fromDate(new Date()),
  //   };
  //   if (this.usuarioActual.perfil === 'cliente') {
  //     if (this.usuarioActual.esAnonimo) {
  //       elemento.nombre =
  //         this.usuarioActual.nombre +
  //         ' (anónimo) Mesa ' +
  //         this.usuarioActual.mesa.numero;
  //     } else {
  //       elemento.nombre =
  //         this.usuarioActual.nombre +
  //         ' ' +
  //         this.usuarioActual.apellido +
  //         ' Mesa ' +
  //         this.usuarioActual.mesa.numero;
  //     }
  //     this.pushService.enviarPushRol(
  //       'Nueva consulta de cliente',
  //       `${elemento.nombre} ha enviado un mensaje`,
  //       'mozo'
  //     );
  //   } else {
  //     elemento.nombre =
  //       this.usuarioActual.nombre +
  //       ' ' +
  //       this.usuarioActual.apellido +
  //       ' (Mozo)';
  //   }
  //   this.firebase.guardarMensaje(elemento);
  //   //this.content.scrollToBottom(0);
  //   this.mensaje = '';
  // }
  enviarMensaje() {
  if (!this.mensaje || !this.mensaje.trim()) return;

  const elemento: any = {
    mensaje: this.mensaje.trim(),
    userUID: this.usuarioActual.uid,
    fechaLocal: new Date()
  };

  console.log('MENSAJE A GUARDAR:', elemento);

  if (this.usuarioActual.perfil === 'cliente') {
    elemento.nombre = this.usuarioActual.esAnonimo
      ? `${this.usuarioActual.nombre} (anónimo) Mesa ${this.usuarioActual.mesa.numero}`
      : `${this.usuarioActual.nombre} ${this.usuarioActual.apellido} Mesa ${this.usuarioActual.mesa.numero}`;

    this.pushService.enviarPushRol(
      'Nueva consulta de cliente',
      `${elemento.nombre} ha enviado un mensaje`,
      'mozo'
    );
  } else {
    elemento.nombre = `${this.usuarioActual.nombre} ${this.usuarioActual.apellido} (Mozo)`;
  }

  this.firebase.guardarMensaje(elemento)
    .then(() => {
      this.mensaje = '';
      setTimeout(() => this.content.scrollToBottom(0), 100);
    })
    .catch(err => console.error('Error enviando mensaje', err));
}


  // trackByFn(mensaje: any) {
  //   return mensaje.fecha;
  // }
  trackByFn(index: number, mensaje: any) {
    return mensaje.id;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
