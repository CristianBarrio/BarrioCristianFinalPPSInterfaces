/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { doc, Firestore, updateDoc } from '@angular/fire/firestore';
import {
  ActionPerformed,
  PushNotifications,
  PushNotificationSchema,
  Token,
} from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FirebaseService } from './firebase.service';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private plt: Platform,
    private firebase: FirebaseService,
    private http: HttpClient
  ) {}

  inicializarPushService() {
    if (this.plt.is('android')) {
      this.addListeners();
      this.registerNotifications();
    } else {
      console.info('Estoy en un web browser');
      if (this.firebase.usuario['esAnonimo'])
        console.info('No actualizo token con usuario anónimo');
      else {
        this.firebase
          .updateToken(this.firebase.usuario['uid'], 'Token falso test')
          .then(() => {
            console.log('Se guardó el Token en la BD');
            //alert(token.value);
          });
      }
    }
  }

  async registerNotifications() {
    let permStatus = await PushNotifications.checkPermissions();
    if (permStatus.receive === 'prompt') {
      permStatus = await PushNotifications.requestPermissions();
    }
    if (permStatus.receive !== 'granted') {
      console.info('Se negó el permiso');
    }
    await PushNotifications.register();
  }

  async addListeners() {
    await PushNotifications.addListener('registration', (token) => {
      console.log('Registration token: ', token.value);
      this.firebase
        .updateToken(this.firebase.usuario['uid'], token.value)
        .then(() => {
          console.log('Se guardó el Token en la BD');
          //alert(token.value);
        });
      //alert(token.value);
    });
    await PushNotifications.addListener('registrationError', (err) => {
      console.error('Registration error: ', err.error);
    });
    await PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push notification received: ', notification);
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title || '',
              body: notification.body || '',
              id: 1,
              extra: {
                data: notification.data,
              },
              autoCancel:true
            },
          ],
        });
      }
    );
    await PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification) => {
        console.log(
          'Push notification action performed',
          notification.actionId,
          notification.inputValue
        );
      }
    );
  }

  enviarPush(titulo: string, mensaje: string, token: string) {
    //let url = 'https://cdmcomanda.adaptable.app/send-mail';
    let url = 'https://us-central1-pps-sp-b0c30.cloudfunctions.net/app/notify';
    let body = {
      title: titulo,
      body: mensaje,
      token: token,
    };
    this.http.post<any>(url, body).subscribe((data) => {
      console.info(data);
    });
  }

  enviarPushRol(titulo: string, mensaje: string, rol: string) {
    //let url = 'https://cdmcomanda.adaptable.app/send-mail';
    let url = 'https://us-central1-pps-sp-b0c30.cloudfunctions.net/app/notify-role';
    let body = {
      title: titulo,
      body: mensaje,
      role: rol,
    };
    this.http.post<any>(url, body).subscribe((data) => {
      console.info(data);
    });
  }
}
