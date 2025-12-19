/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { where } from 'firebase/firestore';

@Component({
  selector: 'app-tabla-mesas',
  templateUrl: './tabla-mesas.component.html',
  styleUrls: ['./tabla-mesas.component.scss'],
})
export class TablaMesasComponent  implements OnInit {
  @Output() enviarMesa = new EventEmitter<any>();

  query = {};

  mesas = this.firestore.traerColeccion('mesas', this.query);

  constructor(private firestore: FirebaseService) { }

  ngOnInit() {}

  enviar(mesa:any) {
    this.enviarMesa.emit(mesa);
  }

}
