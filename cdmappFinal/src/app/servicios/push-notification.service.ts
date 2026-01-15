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
import { Capacitor } from '@capacitor/core';

@Injectable({
  providedIn: 'root',
})
export class PushNotificationService {
  constructor(
    private firebase: FirebaseService,
    private http: HttpClient
  ) {}

  async inicializarPushService() {
    if (!Capacitor.isNativePlatform()) {
      console.log('Push no disponible en web');
      return;
    }

    const perm = await PushNotifications.requestPermissions();
    if (perm.receive !== 'granted') {
      console.log('Permiso denegado');
      return;
    }

    await LocalNotifications.requestPermissions();

    await PushNotifications.register();
    this.addListeners();
  }

  addListeners() {
    PushNotifications.addListener('registration', (token) => {
      console.log('FCM TOKEN:', token.value);

      this.firebase.updateToken(
        this.firebase.usuario['uid'],
        token.value
      );
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
        console.log('Push recibida (foreground):', notification);

        LocalNotifications.schedule({
          notifications: [
            {
              id: Date.now(),
              title: notification.title || 'Notificación',
              body: notification.body || '',
              autoCancel: true,
            },
          ],
        });
      }
    );
    /*
      PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {
        console.log('Push recibida (foreground):', notification);

        LocalNotifications.schedule({
          notifications: [
            {
              id: Date.now(),
              title: notification.title ?? '',
              body: notification.body ?? '',
              extra: notification.data,
              autoCancel: true,
            },
          ],
        });
      }
    );
    */ 

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification) => {

        const user = this.firebase.usuario;
        if (!user) return;

        const rolePush = notification.data?.role;
        if (rolePush && user['tipo'] !== rolePush) return;

        LocalNotifications.schedule({
          notifications: [{
            id: Date.now(),
            title: notification.title ?? '',
            body: notification.body ?? '',
          }],
        });
      }
    );

    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
        console.log('Usuario tocó la notificación', notification);
        // acá podés navegar a una pantalla
      }
    );
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


  enviarPush(titulo: string, mensaje: string, token: string) {
    const url = 'https://us-central1-TU-PROYECTO.cloudfunctions.net/notifyUser';

    this.http.post(url, {
      title: titulo,
      body: mensaje,
      token: token,
    }).subscribe();
    console.info(titulo + ' ' + mensaje + ' ' + token);
  }


  enviarPushRol(titulo: string, mensaje: string, rol: string) {
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
