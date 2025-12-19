/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { or, where } from 'firebase/firestore';
import { FirebaseService } from '../../servicios/firebase.service';

@Component({
  selector: 'app-tabla-admins',
  templateUrl: './tabla-admins.component.html',
  styleUrls: ['./tabla-admins.component.scss'],
})
export class TablaAdminsComponent  implements OnInit {
  @Output() enviarUser = new EventEmitter<any>();
       queryTest = or(
      where("perfil", "==", "dueño"),
      where("perfil", "==", "supervisor")
    );

  usuarios = this.firestore.traerColeccion('usuarios', this.queryTest);

  constructor(private firestore: FirebaseService) { }

  ngOnInit() {}

  enviar(user:any) {
    this.enviarUser.emit(user);
  }

}
