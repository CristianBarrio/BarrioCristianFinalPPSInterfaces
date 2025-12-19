/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';
import { TemasService } from 'src/app/servicios/temas.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  usuarioActual;
  temaActual = 'tema-argentina';

  constructor(
    private pushService: PushNotificationService,
    private firebase: FirebaseService,
    private router: Router,
    private temaSvc: TemasService,
    private utilsSvc: UtilsService
  ) {
    this.usuarioActual = this.firebase.usuario;
  }

  ngOnInit() {
    this.pushService.inicializarPushService();
    
    this.temaActual = `tema-${this.temaSvc.getTema().toLowerCase()}`;
    this.temaSvc.temaActual$.subscribe(tema => {
      this.temaActual = `tema-${tema.toLowerCase()}`;
    });
  }

  salir() {
    this.firebase.logOut(this.usuarioActual.uid).then(() => {
      this.usuarioActual = null;
      this.router.navigate(['/login']);
      this.utilsSvc.play('salir');
    });
  }

  test() {
    this.usuarioActual.enEspera = !this.usuarioActual.enEspera;
    this.firebase.verUsuario();
  }
}
