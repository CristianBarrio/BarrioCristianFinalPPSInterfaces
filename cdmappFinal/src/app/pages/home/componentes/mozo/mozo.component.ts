/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, inject, OnInit } from '@angular/core';
import { where } from 'firebase/firestore';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { ChatComponent } from '../chat/chat.component';
import { LoadingController, ModalController } from '@ionic/angular';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';
import { UtilsService } from 'src/app/servicios/utils.service';
import { PushApiService } from 'src/app/servicios/push-api.service';

@Component({
  selector: 'app-mozo',
  templateUrl: './mozo.component.html',
  styleUrls: ['./mozo.component.scss'],
})
export class MozoComponent implements OnInit {
  $pedidosAConfirmar = this.firebase.traerColeccion(
    'pedidos',
    where('estado', '==', 'aConfirmar')
  );
  $pedidosEnProceso = this.firebase.traerColeccion(
    'pedidos',
    where('estado', '==', 'enProceso')
  );
  $pedidosEntregados = this.firebase.traerColeccion(
    'pedidos',
    where('estado', '==', 'entregado')
  );
  $pedidosACobrar = this.firebase.traerColeccion(
    'pedidos',
    where('estado', '==', 'pagando')
  );

  utilsSvc = inject(UtilsService);
  usuarioActual: any;

  constructor(
    private firebase: FirebaseService,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    //private pushService: PushNotificationService,
    private pushService: PushApiService,
    //private utilsSvc: UtilsService
  ) {
    this.usuarioActual = this.firebase.usuario;
  }

  ngOnInit() {}

  cambiarEstado(pedido: any, estado: string) {
    pedido.estado = estado;
    this.utilsSvc.play('elegir');
    if (estado === 'enProceso') {
      this.pushService.enviarPushRol(
        'cocinero',
        'Nueva orden',
        `Recibió una nueva orden de la mesa ${pedido.mesa.numero}`,
      );
      this.pushService.enviarPushRol(
        'bartender',
        'Nueva orden',
        `Recibió una nueva orden de la mesa ${pedido.mesa.numero}`,
      );
    }
    this.firebase.update('pedidos', pedido);
  }

  async modalChat() {
    this.utilsSvc.play('confirmar');
    const modal = await this.modalCtrl.create({
      component: ChatComponent,
      componentProps: {
        usuarioActual: this.usuarioActual,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.info(data);
    if (role === 'confirm') {
    }
  }

  cobrarPedido(pedido) {
    let coleccion = 'usuarios';
    if (pedido.cliente.esAnonimo) {
      coleccion = 'usuariosAnonimos';
    }
    this.showLoading().then(() => {
      console.info(pedido);
      pedido.cliente.enEspera = false;
      pedido.cliente.cargoEncuesta = false;
      pedido.cliente.tieneMesa = false;
      pedido.cliente.tienePedido = false;
      pedido.cliente.mesa = {};
      pedido.mesa.estado = 'libre';
      pedido.mesa.cliente = {};
      pedido.estado = 'finalizado';
      this.firebase.update(coleccion, pedido.cliente).then(() => {
        this.firebase.update('mesas', pedido.mesa).then(() => {
          this.firebase.update('pedidos', pedido).then(() => {
            console.info('Bds actualizadas');
          });
        });
      });
      setTimeout(() => {
        this.loadingCtrl.dismiss();
      }, 5000);
    });
  }

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere por favor...',
      cssClass: 'custom-loading'
    });
    loading.present();
  }
}
