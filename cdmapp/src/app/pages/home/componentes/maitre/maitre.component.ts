// /* eslint-disable @angular-eslint/no-empty-lifecycle-method */
// import { Component, OnInit } from '@angular/core';
// import { orderBy, where } from 'firebase/firestore';
// import { FirebaseService } from 'src/app/servicios/firebase.service';

// @Component({
//   selector: 'app-maitre',
//   templateUrl: './maitre.component.html',
//   styleUrls: ['./maitre.component.scss'],
// })
// export class MaitreComponent implements OnInit {
//   $listaEspera: any = this.firebase.traerColeccion(
//     'usuarios',
//     where('enEspera', '==', true)
//   );
//   $mesas: any = this.firebase.traerColeccion('mesas', orderBy('numero'));
//   $mesasLibres: any = this.firebase.traerColeccion(
//     'mesas',
//     where('estado', '==', 'libre'),
//     orderBy('numero')
//   );
//   $listaEsperaAnonimos: any = this.firebase.traerColeccion(
//     'usuariosAnonimos',
//     where('enEspera', '==', true)
//   );;

//   constructor(private firebase: FirebaseService) {}

//   ngOnInit() {}

//   asignarMesa(mesa: any, cliente: any) {
//     let coleccionUsuarios = 'usuarios';
//     let mesaTemp = {
//       numero: mesa.numero,
//       foto: mesa.foto,
//       tipo: mesa.tipo,
//       capacidad: mesa.capacidad,
//       uid:mesa.uid
//     };
//     let clienteTemp = {
//       nombre: cliente.nombre,
//       apellido: cliente.apellido,
//       foto: cliente.foto,
//       correo: cliente.correo,
//       uid: cliente.uid,
//       esAnonimo: cliente.esAnonimo
//     };
//     if (cliente.esAnonimo) {
//       coleccionUsuarios = 'usuariosAnonimos'
//       delete clienteTemp.apellido;
//       delete clienteTemp.correo;
//     }

//     mesa.estado = 'ocupada';
//     mesa.cliente = clienteTemp;
//     cliente.enEspera = false;
//     cliente.tieneMesa = true;
//     cliente.mesa = mesaTemp;
//     this.firebase.update(coleccionUsuarios, cliente).then(() => {
//       this.firebase.update('mesas', mesa).then(() => {
//         console.info('bds actualizadas');
//       });
//     });
//   }
// }
import { Component, OnInit } from '@angular/core';
//import { orderBy, where } from 'firebase/firestore';
import { orderBy, where } from '@angular/fire/firestore';
import { FirebaseService } from 'src/app/servicios/firebase.service';

@Component({
  selector: 'app-maitre',
  templateUrl: './maitre.component.html',
  styleUrls: ['./maitre.component.scss'],
})
export class MaitreComponent implements OnInit {

  $listaEspera = this.firebase.traerColeccion(
    'usuarios',
    where('enEspera', '==', true)
  );

  $listaEsperaAnonimos = this.firebase.traerColeccion(
    'usuariosAnonimos',
    where('enEspera', '==', true)
  );

  $mesas = this.firebase.traerColeccion(
    'mesas',
    orderBy('numero')
  );

  $mesasLibres = this.firebase.traerColeccion(
    'mesas',
    where('estado', '==', 'libre'),
    orderBy('numero')
  );

  constructor(private firebase: FirebaseService) {}

  ngOnInit() {}

  asignarMesa(mesa: any, cliente: any) {

    let coleccionUsuarios = 'usuarios';

    const mesaTemp = {
      numero: mesa.numero,
      foto: mesa.foto,
      tipo: mesa.tipo,
      capacidad: mesa.capacidad,
      uid: mesa.uid,
    };

    const clienteTemp: any = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      foto: cliente.foto,
      correo: cliente.correo,
      uid: cliente.uid,
      esAnonimo: cliente.esAnonimo,
    };

    if (cliente.esAnonimo) {
      coleccionUsuarios = 'usuariosAnonimos';
      delete clienteTemp.apellido;
      delete clienteTemp.correo;
    }

    const mesaUpdate = {
      ...mesa,
      estado: 'ocupada',
      cliente: clienteTemp,
    };

    const clienteUpdate = {
      ...cliente,
      enEspera: false,
      tieneMesa: true,
      mesa: mesaTemp,
    };

    this.firebase.update(coleccionUsuarios, clienteUpdate).then(() => {
      this.firebase.update('mesas', mesaUpdate).then(() => {
        console.info('bds actualizadas');
      });
    });
  }
}
