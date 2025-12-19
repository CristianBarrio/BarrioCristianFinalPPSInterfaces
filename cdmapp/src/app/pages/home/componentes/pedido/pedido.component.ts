/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicios/firebase.service';

export interface Ipedido {
  productos: Iproducto[];
  listoCocina: false;
  listoBartender: false;
  mesa: {};
  mozo: {};
  cliente: {};
  estado: 'aConfirmar';
  monto: 0;
}

export interface Iproducto {
  uid: string;
  nombre: string;
  precio: number;
  tiempoPreparacion: number;
  cantidad: number;
  tipo: string;
}

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.scss'],
})
export class PedidoComponent {
  productos: any;
  total = 0;
  tiempo = 0;

  pedido: Ipedido = {
    productos: [],
    listoCocina: false,
    listoBartender: false,
    mesa: {},
    mozo: {},
    cliente: {},
    estado: 'aConfirmar',
    monto: 0,
  };

  usuarioActual = this.navParams.get('usuarioActual');

  constructor(
    private modalCtrl: ModalController,
    private navParams: NavParams,
    private firebase: FirebaseService
  ) {
    this.productos = this.firebase.traerColeccion('productos', {});
  }

  agregarAlArray(producto) {
    let elemento = this.pedido.productos.find((i) => i.uid === producto.uid);
    if (elemento === undefined) {
      let item: Iproducto = {
        uid: producto.uid,
        nombre: producto.nombre,
        precio: producto.precio,
        tiempoPreparacion: producto.tiempoPreparacion,
        cantidad: 1,
        tipo: producto.tipo,
      };
      this.pedido.productos.push(item);
    } else elemento.cantidad++;
    this.calcularTotal();
    this.calcularTiempo();
  }

  quitarDelArray(producto) {
    let elemento = this.pedido.productos.find((i) => i.uid === producto.uid);
    if (elemento !== undefined) {
      if (elemento.cantidad === 1) {
        this.pedido.productos = this.pedido.productos.filter(
          (e) => e.uid !== producto.uid
        );
      } else {
        elemento.cantidad--;
      }
    }
    this.calcularTotal();
    this.calcularTiempo();
  }

  estaEnElArray(uid: string) {
    return this.pedido.productos.find((i) => i.uid === uid) === undefined;
  }

  calcularTotal() {
    let sumatoria = 0;
    this.pedido.productos.forEach((element) => {
      sumatoria += element.precio * element.cantidad;
    });
    this.total = sumatoria;
  }

  calcularTiempo() {
    let mayor = 0;
    this.pedido.productos.forEach((element) => {
      if (element.tiempoPreparacion > mayor) mayor = element.tiempoPreparacion;
    });
    this.tiempo = mayor;
  }

  calcularCantidad(uid: string) {
    let item = this.pedido.productos.find((i) => i.uid === uid);
    if (item !== undefined) {
      return item.cantidad;
    } else return 0;
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(pedido: Ipedido) {
    this.pedido.cliente = this.usuarioActual;
    this.pedido.mesa = this.usuarioActual.mesa;
    return this.modalCtrl.dismiss(pedido, 'confirm');
  }
}
