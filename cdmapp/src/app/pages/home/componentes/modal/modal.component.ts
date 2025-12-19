import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent   {

  usuarioActual = this.navParams.get('usuarioActual');

  constructor(private modalCtrl: ModalController, private navParams: NavParams) {}

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(accion:string) {
    return this.modalCtrl.dismiss(accion, 'confirm');
  }

}
