/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { where } from 'firebase/firestore';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-bartender',
  templateUrl: './bartender.component.html',
  styleUrls: ['./bartender.component.scss'],
})
export class BartenderComponent implements OnInit {
  $pedidosEnProceso = this.firebase.traerColeccion(
    'pedidos',
    where('estado', '==', 'enProceso')
  );

  constructor(
    private firebase: FirebaseService,
    private pushService: PushNotificationService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {}

  cambiarEstado(pedido: any, estado: boolean) {
    pedido.listoBartender = estado;
    this.firebase.update('pedidos', pedido);
    this.utilsSvc.play('elegir');
    this.pushService.enviarPushRol(
      'Orden lista',
      `El bartender marcó como lista la orden de la mesa ${pedido.mesa.numero}`,
      'mozo'
    );
  }
}
