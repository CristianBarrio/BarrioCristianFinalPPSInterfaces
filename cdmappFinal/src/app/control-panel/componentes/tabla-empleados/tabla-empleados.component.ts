/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { or, where } from 'firebase/firestore';
import { FirebaseService } from '../../servicios/firebase.service';

@Component({
  selector: 'app-tabla-empleados',
  templateUrl: './tabla-empleados.component.html',
  styleUrls: ['./tabla-empleados.component.scss'],
})
export class TablaEmpleadosComponent  implements OnInit {
  @Output() enviarUser = new EventEmitter<any>();
  queryTest = where("perfil", "==", "empleado");

  usuarios = this.firestore.traerColeccion('usuarios', this.queryTest);

  constructor(private firestore: FirebaseService) { }

  ngOnInit() {}

  enviar(user:any) {
    this.enviarUser.emit(user);
  }

}
