import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotifications } from '@capacitor/push-notifications';
import { LocalNotifications } from '@capacitor/local-notifications';
import { TemasService } from './servicios/temas.service';
import { PushNotificationService } from './servicios/push-notification.service';
import { Platform } from '@ionic/angular';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import OneSignal from 'onesignal-cordova-plugin';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(public router: Router,
    public temaSvc: TemasService,
    private platform: Platform
  ) {
   this.initializeApp(); 
     this.platform.ready().then(async () => {
      await BarcodeScanner.installGoogleBarcodeScannerModule();

      OneSignal.Debug.setLogLevel(6);
      OneSignal.initialize('437c386d-d2f2-4a5e-8c5c-49a11c6f90fb');

      OneSignal.Notifications.requestPermission(true);
    });
  }

  ngOnInit() {
    this.temaSvc.temaActual$.subscribe(theme => {
      document.body.className = '';
      document.body.classList.add(`tema-${theme}`);
    });

    const saved = localStorage.getItem('theme');
    if (saved) {
      this.temaSvc.setTema(saved);
    }
  }

  initializeApp() {
    this.router.navigateByUrl('splash');
  }
}
