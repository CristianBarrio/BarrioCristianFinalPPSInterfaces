/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuarioActual;

  constructor(
    private pushService: PushNotificationService,
    private firebase: FirebaseService,
    private router: Router,
  ) {
    this.usuarioActual = this.firebase.usuario;
  }

  ngOnInit() {
    this.pushService.inicializarPushService();
  }

  salir() {
    this.firebase.logOut(this.usuarioActual.uid).then(() => {
      this.usuarioActual = null;
      this.router.navigate(['/login']);
    });
  }

  test() {
    this.usuarioActual.enEspera = !this.usuarioActual.enEspera;
    this.firebase.verUsuario();
  }
}
