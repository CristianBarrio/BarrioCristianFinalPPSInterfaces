/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { where } from 'firebase/firestore';
import { FirebaseService } from '../../servicios/firebase.service';

@Component({
  selector: 'app-tabla-clientes',
  templateUrl: './tabla-clientes.component.html',
  styleUrls: ['./tabla-clientes.component.scss'],
})
export class TablaClientesComponent  implements OnInit {
  @Output() enviarUser = new EventEmitter<any>();
  query = where("perfil", "==", "cliente");

  usuarios = this.firestore.traerColeccion('usuarios', this.query);

  constructor(private firestore: FirebaseService) { }

  ngOnInit() {}

  enviar(user:any) {
    this.enviarUser.emit(user);
  }

}
