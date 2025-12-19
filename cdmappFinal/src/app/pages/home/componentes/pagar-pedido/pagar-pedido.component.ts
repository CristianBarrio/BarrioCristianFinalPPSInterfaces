/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { ModalController, NavParams, ToastController } from '@ionic/angular';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-pagar-pedido',
  templateUrl: './pagar-pedido.component.html',
  styleUrls: ['./pagar-pedido.component.scss'],
})
export class PagarPedidoComponent implements OnInit {
  usuarioActual = this.navParams.get('usuarioActual');
  pedidoActual = this.navParams.get('pedidoActual');
  subtotal = 0;
  total = 0;
  propina = 0;
  cantidadaPropina: any;
  porcentaje = '0';

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private toastController: ToastController,
    private utilsSvc: UtilsService
  ) {
    this.calcularSubtotal();
  }

  cambiarPropina(propina: any) {
    switch (propina) {
      case 'nada':
        this.cantidadaPropina = 0;
        this.calcularPropina();
        this.calcularSubtotal();
        break;
      default:
        this.cantidadaPropina = propina;
        this.calcularPropina();
        this.calcularSubtotal();
        break;
    }
  }

  ngOnInit() {}

  async scan(): Promise<void> {
    
    let codigo = await BarcodeScanner.scan();
    switch (codigo.barcodes[0].displayValue) {
      case 'nada':
        this.cantidadaPropina = 0;
        this.calcularPropina();
        this.calcularSubtotal();
        break;
      default:
        if (+codigo.barcodes[0].displayValue > 0 && +codigo.barcodes[0].displayValue <= 20) {
          this.cantidadaPropina = codigo.barcodes[0].displayValue;
          this.calcularPropina();
          this.calcularSubtotal();
        }
        break;
    }
  }

  calcularSubtotal() {
    let sumatoria = 0;
    this.pedidoActual.productos.forEach((element) => {
      sumatoria += element.precio * element.cantidad;
    });
    this.subtotal = sumatoria;
  }

  calcularPropina() {
    this.propina = (this.subtotal * this.cantidadaPropina) / 100;
  }

  confirm(accion: string) {
    this.utilsSvc.play('victoria');
    let data = { accion: accion, monto: this.subtotal + this.propina };
    return this.modalCtrl.dismiss(data, 'confirm');
  }

  async toast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'middle',
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
}
