/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { ModalController, ToastController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-opciones-cliente',
  templateUrl: './opciones-cliente.component.html',
  styleUrls: ['./opciones-cliente.component.scss'],
})
export class OpcionesClienteComponent {
  usuarioActual = this.navParams.get('usuarioActual');
  pedidoActual = this.navParams.get('pedidoActual');

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastController: ToastController
  ) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(accion: string) {
    return this.modalCtrl.dismiss(accion, 'confirm');
  }

  async verEstado() {
    let mensaje = '';
    switch (this.pedidoActual.estado) {
      case 'aConfirmar':
        mensaje = 'Estamos confirmando su pedido.'
        break;
      case 'enProceso':
        mensaje = 'Su pedido está siendo preparado!'
        break;
      case 'entregado':
        mensaje = 'El mozo está en camino con su pedido!'
        break;
      case 'recibido':
        mensaje = 'Ya tiene su pedido, que lo disfrute!'
        break;
      case 'pagando':
        mensaje = 'El mozo está cobrando la cuenta'
        break;
      default:
        break;
    }
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'middle',
      cssClass: 'custom-toast'
    });
    await toast.present();
    this.cancel();
  }
}
