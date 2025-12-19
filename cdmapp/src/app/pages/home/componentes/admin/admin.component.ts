/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { where } from 'firebase/firestore';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {


  $clientes = this.firebase.traerColeccion(
    'usuarios',
    where('perfil', '==', 'cliente')
  );

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {}


  // cambiarAcceso(uid:string, nombre:string, correo:string,acceso: string) {
  //   let decision = acceso === 'aceptado';
  //   this.firebase.cambiarAcceso(uid,acceso).then(()=>{
  //     console.info('Se cambió el acceso');
  //     this.firebase.enviarMail(correo, nombre, decision);
  //   });
  // }
  cambiarAcceso(uid: string, nombre: string, correo: string, acceso: string) {
    let decision = acceso === 'aceptado';
    
    this.firebase.cambiarAcceso(uid, acceso).then(() => {
      console.info('Se cambió el acceso');

      this.firebase.enviarMail(correo, nombre, decision);
    }).catch(err => {
      console.error('Error al cambiar acceso:', err);
    });
  }
}
