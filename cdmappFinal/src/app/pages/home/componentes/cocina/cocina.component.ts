/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { where } from 'firebase/firestore';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { PushApiService } from 'src/app/servicios/push-api.service';

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
    private pushService: PushApiService,
    private utilsSvc: UtilsService
  ) {
  }

  ngOnInit() {
  }
 

  cambiarEstado(pedido: any, estado: boolean) {
    pedido.listoCocina = estado;
    this.firebase.update('pedidos', pedido);
    this.utilsSvc.play('elegir');
    this.pushService.enviarPushRol(
      'mozo',
      'Orden lista',
      `La cocina marcó como lista la orden de la mesa ${pedido.mesa.numero}`,
    );
    // this.pushService.sendToRole(
    //   'Orden lista',
    //   `La cocina marcó como lista la orden de la mesa ${pedido.mesa.numero}`,
    //   'mozo'
    // );
  }

}
