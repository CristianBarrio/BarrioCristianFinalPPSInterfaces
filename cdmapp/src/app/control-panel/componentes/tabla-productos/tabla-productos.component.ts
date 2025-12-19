/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { where } from 'firebase/firestore';

@Component({
  selector: 'app-tabla-productos',
  templateUrl: './tabla-productos.component.html',
  styleUrls: ['./tabla-productos.component.scss'],
})
export class TablaProductosComponent  implements OnInit {
  @Output() enviarProducto = new EventEmitter<any>();

  query = {};

  productos = this.firestore.traerColeccion('productos', this.query);

  constructor(private firestore: FirebaseService) { }

  ngOnInit() {}

  enviar(producto:any) {
    this.enviarProducto.emit(producto);
  }

}
