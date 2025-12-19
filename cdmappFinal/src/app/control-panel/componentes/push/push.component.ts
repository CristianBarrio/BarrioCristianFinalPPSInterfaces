import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-push',
  templateUrl: './push.component.html',
  styleUrls: ['./push.component.scss'],
})
export class PushComponent implements OnInit {

  titulo:string = 'Título de la push notification';
  mensaje: string = 'Mensaje de prueba de la push notification';
  rol: string = 'cocinero';
  token:string = 'ezq4hyE_SRGrr_XKZuszcU:APA91bHtnhAy-HNP_4HWFHqZACqVc0zoq7OpXb3ExOmuvWWtJ5WI3LABor2c8aWKIyeK3IJpK56hRfQA7KLULmJO5-obAUmzHzLkbmXe9zZ42rq5tWsRwfDI24XFWsvIF9gipGW8W-BL';



  constructor(private firebase: FirebaseService, private plt:Platform) {}

  sendPush() {
    this.firebase.enviarPush(this.titulo, this.mensaje, this.token);
  }

  sendPushRol() {
    this.firebase.enviarPushRol(this.titulo, this.mensaje, this.rol);
  }

  ngOnInit(): void {
    if (this.plt.is('android')) {
      this.addListeners();
      this.registerNotifications();
    }
    else{
      console.info('Estoy en un web browser');
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
              id: new Date().getMilliseconds(),
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

}
