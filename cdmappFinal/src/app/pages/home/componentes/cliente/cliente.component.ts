/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { IonModal, ModalController, ToastController } from '@ionic/angular';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { OverlayEventDetail } from '@ionic/core/components';
import { ModalComponent } from '../modal/modal.component';
import { PedidoComponent } from '../pedido/pedido.component';
import { ChatComponent } from '../chat/chat.component';
import { OpcionesClienteComponent } from '../opciones-cliente/opciones-cliente.component';
import { EncuestasComponent } from '../encuestas/encuestas.component';
import { CargarEncuestaComponent } from '../cargar-encuesta/cargar-encuesta.component';
import { PagarPedidoComponent } from '../pagar-pedido/pagar-pedido.component';
import { PushNotificationService } from 'src/app/servicios/push-notification.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-cliente',
  templateUrl: './cliente.component.html',
  styleUrls: ['./cliente.component.scss'],
})
export class ClienteComponent implements OnInit {
  @ViewChild(IonModal) modal: IonModal;

  usuarioActual: any;
  pedidoActual: any;

  constructor(
    private router: Router,
    private firebase: FirebaseService,
    private modalCtrl: ModalController,
    private toastController: ToastController,
    private pushService: PushNotificationService,
    private utilsSvc: UtilsService
  ) {
    this.usuarioActual = this.firebase.usuario;
    setInterval(() => {
      this.usuarioActual = this.firebase.usuario;
    }, 1000);
  }
  
  async scan(): Promise<void> {
    const codigo = await BarcodeScanner.scan();
    const value = codigo.barcodes[0].displayValue;

    switch (value) {
      case 'lobby':
        this.openModal();
        break;

      default:
        if (!this.usuarioActual.tieneMesa) {
          this.toast('Usted no tiene mesa asignada');
          return;
        }

        if (this.usuarioActual.mesa.uid === value) {
          this.modalOpciones();
        } else {
          this.toast(
            'Esta no es su mesa, su mesa es la número ' +
            this.usuarioActual.mesa.numero
          );
        }
        break;
    }
  }


  // ngOnInit() {
  //   this.usuarioActual = this.firebase.usuario;

  //   if (this.usuarioActual?.tienePedido) {
  //     this.monitorearPedido(this.usuarioActual.uid);
  //   }
  // }
ngOnInit() {
  const check = setInterval(() => {
    const user = this.firebase.usuario;

    if (!user) return;

    this.usuarioActual = user;

    if (user['tienePedido'] && user['pedidoUid']) {
      this.monitorearPedido(user['pedidoUid']);
    }

    clearInterval(check);
  }, 200);
}


  async openModal() {
    const modal = await this.modalCtrl.create({
      component: ModalComponent,
      componentProps: {
        usuarioActual: this.usuarioActual,
        pedidoActual: this.pedidoActual
      },
    });
    
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (data === 'mesa') {
      let nombre = this.usuarioActual.nombre;
      this.usuarioActual.enEspera = true;
      if (this.usuarioActual.esAnonimo) {
        this.firebase.update('usuariosAnonimos', this.usuarioActual);
        nombre += ' (anónimo)';
      } else {
        this.firebase.update('usuarios', this.usuarioActual);
        nombre += ' ' + this.usuarioActual.apellido;
      }
      this.pushService.enviarPushRol(
        'Nuevo cliente en espera',
        `El usuario ${nombre} ha ingresado a la cola`,
        'maitre'
      );
    }
    if(data === 'encuestas'){
      this.modalEncuestas();
    }
  }

  // async modalPedido() {
  //   const modal = await this.modalCtrl.create({
  //     component: PedidoComponent,
  //     componentProps: {
  //       usuarioActual: this.usuarioActual,
  //     },
  //   });
  //   modal.present();
  //   const { data, role } = await modal.onWillDismiss();
  //   console.info(data);
  //   this.pedidoActual = data;
  //   this.pedidoActual.uid = this.firebase.generateUniqueFirestoreId();
  //   if (role === 'confirm') {
  //     this.usuarioActual.tienePedido = true;
  //     this.usuarioActual.enEspera = false;
  //     this.usuarioActual.pedidoUid = this.pedidoActual.uid;//
  //     if (this.usuarioActual.esAnonimo) {
  //       this.firebase.update('usuariosAnonimos', this.usuarioActual);
  //     } else {
  //       this.firebase.update('usuarios', this.usuarioActual);
  //     }
  //     this.firebase.guardarPedidoEnFirebase(this.pedidoActual).then(() => {
  //       this.monitorearPedido(this.pedidoActual.uid);
  //     });
  //   }
  // }
  async modalPedido() {
    const modal = await this.modalCtrl.create({
      component: PedidoComponent,
      componentProps: {
        usuarioActual: this.usuarioActual,
      },
    });

    await modal.present();
    const { data, role } = await modal.onWillDismiss();

    if (role !== 'confirm') return;

    const pedidoUid = this.firebase.generateUniqueFirestoreId();

    this.pedidoActual = {
      ...data,
      uid: pedidoUid,
    };

    this.usuarioActual.tienePedido = true;
    this.usuarioActual.pedidoUid = pedidoUid;

    await this.firebase.update('usuarios', this.usuarioActual);
    await this.firebase.guardarPedidoEnFirebase(this.pedidoActual);

    this.monitorearPedido(pedidoUid);
  }


monitorearPedido(uid: string) {
  this.firebase.obsPedido('pedidos', uid);

  this.firebase.pedido$.subscribe(pedido => {
    if (pedido) {
      this.pedidoActual = pedido;
    }
  });
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

  async modalOpciones() {
    if (!this.pedidoActual) {
      console.warn('Pedido aún no cargado');
      return;
    }
    const modal = await this.modalCtrl.create({
      component: OpcionesClienteComponent,
      componentProps: {
        usuarioActual: this.usuarioActual,
        pedidoActual: this.pedidoActual,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.info(data);
    switch (data) {
      case 'hacerPedido':
        this.modalPedido();
        break;
      case 'encuestas':
        this.modalEncuestas();
        break;
      case 'pedirCuenta':
        this.modalPedirCuenta();
        break;
      case 'cargarEncuesta':
        if (this.usuarioActual.cargoEncuesta) {
          this.toast('Ya cargó la encuesta, muchas gracias!');
        } else {
          this.modalCargarEncuesta();
        }
        break;

      default:
        break;
    }
  }

  async modalEncuestas() {
    const modal = await this.modalCtrl.create({
      component: EncuestasComponent,
      componentProps: {
        usuarioActual: this.usuarioActual,
        pedidoActual: this.pedidoActual,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.info(data);
    if (role === 'encuestas') {
    }
  }

  async modalCargarEncuesta() {
    const modal = await this.modalCtrl.create({
      component: CargarEncuestaComponent,
      componentProps: {
        usuarioActual: this.usuarioActual,
        pedidoActual: this.pedidoActual,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.info(data);
    if (role === 'encuestas') {
    }
  }

  async modalPedirCuenta() {
    const modal = await this.modalCtrl.create({
      component: PagarPedidoComponent,
      componentProps: {
        usuarioActual: this.usuarioActual,
        pedidoActual: this.pedidoActual,
      },
    });
    modal.present();
    const { data, role } = await modal.onWillDismiss();
    console.info(data);
    if (data.accion === 'pagar') {
      this.pedidoActual.monto = data.monto;
      this.cambiarEstado('pagando');
      this.pushService.enviarPushRol(
        'Un cliente pidió la cuenta',
        `La mesa ${this.pedidoActual.mesa.numero} ha pedido la cuenta`,
        'mozo'
      );
    }
  }

  cambiarEstado(estado: string) {
    this.pedidoActual.estado = estado;
    this.firebase.update('pedidos', this.pedidoActual);
  }

  async toast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 3000,
      position: 'bottom',
      cssClass: 'custom-toast',
    });
    await toast.present();
  }
     testPush() {
  this.pushService.enviarPush(
    'Orden lista',
    'Push de prueba desde Cocina',
    'cliente'
  );}
}
