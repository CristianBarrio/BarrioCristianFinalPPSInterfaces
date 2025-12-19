/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { where } from 'firebase/firestore';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';
import OneSignal, { OneSignalPlugin } from 'onesignal-cordova-plugin';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-cocina',
  templateUrl: './cocina.component.html',
  styleUrls: ['./cocina.component.scss'],
})
export class CocinaComponent implements OnInit {
  $pedidosEnProceso = this.firebase.traerColeccion(
    'pedidos',
    where('estado', '==', 'enProceso')
  );
  

  constructor(
    private firebase: FirebaseService,
    private pushService: PushNotificationService,
        private utilsSvc: UtilsService
  ) {
    OneSignal.login(this.firebase.usuario['uid']);
    OneSignal.User.addTag("tipo", "cocinero");
  }

  ngOnInit() {
  }
 

  cambiarEstado(pedido: any, estado: boolean) {
    pedido.listoCocina = estado;
    this.firebase.update('pedidos', pedido);
    this.utilsSvc.play('elegir');
    // this.pushService.enviarPushRol(
    //   'Orden lista',
    //   `La cocina marcó como lista la orden de la mesa ${pedido.mesa.numero}`,
    //   'mozo'
    // );
    this.pushService.sendToRole(
      'Orden lista',
      `La cocina marcó como lista la orden de la mesa ${pedido.mesa.numero}`,
      'mozo'
    );
  }

}
