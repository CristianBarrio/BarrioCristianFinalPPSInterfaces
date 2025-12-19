import { Component, Injectable, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController, SegmentChangeEventDetail } from '@ionic/angular';
import { IonSegmentCustomEvent } from '@ionic/core';
import { FirebaseService } from './servicios/firebase.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.page.html',
  styleUrls: ['./control-panel.page.scss'],
})
export class HardcodePage {
  usuarioAdmin: null;
  usuarioEmpleado: null;
  usuarioCliente: null;
  mesa: null;
  producto: null;

  tab = 'pedido';

  constructor(
    private fb: FormBuilder,
    private loadingCtrl: LoadingController,
    private firestore: FirebaseService
  ) {}

  async showLoading() {
    const loading = await this.loadingCtrl.create({
      message: 'Espere por favor...',
    });
    loading.present();
  }

  async guardar(formulario: any, tipo: string) {
    //console.info('Form ', formulario);
    let tempObj = formulario;
    let nombre = Date.now().toString();
    let carpeta: string;
    let sufijo: string;
    let coleccion: string;
    switch (tipo) {
      case 'mesa':
        carpeta = 'fotosMesas';
        sufijo = '_fotoMesa';
        coleccion = 'mesas';
        break;
      case 'producto':
        carpeta = 'fotosProductos';
        sufijo = '_fotoProducto';
        coleccion = 'productos';
        break;
      default:
        carpeta = 'fotosPerfil';
        sufijo = '_fotoPerfil';
        coleccion = 'usuarios';
        break;
    }
    if (tipo === 'producto') {
      //console.info(tempObj);
      await this.showLoading().then(() => {
        for (let index = 0; index < 3; index++) {
          this.firestore
            .subirImagenes(
              tempObj.fotosFile[index],
              carpeta + '/' + tempObj.nombre,
              nombre + '_' + [index] + sufijo
            )
            .then((uploadResult) => {
              this.firestore
                .traerImagen(
                  carpeta + '/' + tempObj.nombre,
                  nombre + '_' + [index] + sufijo
                )
                .then((ruta) => {
                  tempObj.fotos.push(ruta);
                });
            });
        }
        delete tempObj.fotosFile;
        //console.info('fotos: ', tempObj.fotos);
        setTimeout(() => {
          //Workaround porque se guarda más rápido en la coleccion de lo que se suben las imagenes y se setean las rutas
          this.firestore.guardarEnFirebase(tempObj, coleccion).then(() => {
            this.loadingCtrl.dismiss();
          });
        }, 5000);
      });
    } else {
      await this.showLoading().then(() => {
        this.firestore
          .subirImagenes(tempObj.fotoFile, carpeta, nombre + sufijo)
          .then((uploadResult) => {
            this.firestore
              .traerImagen(carpeta, nombre + sufijo)
              .then((ruta) => {
                tempObj.foto = ruta;
                delete tempObj.fotoFile;
                this.firestore
                  .guardarEnFirebase(tempObj, coleccion)
                  .then(() => {
                    this.loadingCtrl.dismiss();
                  });
              });
          });
      });
    }
    //console.info(formulario);
  }

  async actualizar(formulario: any, coleccion: string, tipo: string) {
    //console.info(formulario);
    let tempObj = formulario;
    let nombre = Date.now().toString();
    let carpeta: string;
    let sufijo: string;
    switch (tipo) {
      case 'mesa':
        carpeta = 'fotosMesas';
        sufijo = '_fotoMesa';

        break;
      case 'producto':
        carpeta = 'fotosProductos';
        sufijo = '_fotoProducto';
        break;
      default:
        carpeta = 'fotosPerfil';
        sufijo = '_fotoPerfil';
        break;
    }
    if (tipo === 'producto') {
      await this.showLoading().then(() => {
        if (tempObj.fotosFile) {
          for (let index = 0; index < 3; index++) {
            this.firestore
              .subirImagenes(
                tempObj.fotosFile[index],
                carpeta + '/' + tempObj.nombre,
                nombre + '_' + [index] + sufijo
              )
              .then((uploadResult) => {
                this.firestore
                  .traerImagen(
                    carpeta + '/' + tempObj.nombre,
                    nombre + '_' + [index] + sufijo
                  )
                  .then((ruta) => {
                    tempObj.fotos.push(ruta);
                  });
              });
          }
          delete tempObj.fotosFile;
          setTimeout(() => {
            //Workaround porque se guarda más rápido en la coleccion de lo que se suben las imagenes y se setean las rutas
            this.firestore.update(coleccion, tempObj).then(() => {
              this.loadingCtrl.dismiss();
            });
          }, 5000);
        } else {
          this.firestore.update(coleccion, tempObj).then(() => {
            this.loadingCtrl.dismiss();
          });
        }
      });
    } else {
      await this.showLoading().then(() => {
        if (tempObj.fotoFile) {
          this.firestore
            .subirImagenes(tempObj.fotoFile, carpeta, nombre + sufijo)
            .then((uploadResult) => {
              this.firestore
                .traerImagen(carpeta, nombre + sufijo)
                .then((ruta) => {
                  tempObj.foto = ruta;
                  delete tempObj.fotoFile;
                  this.firestore.update(coleccion, tempObj).then(() => {
                    this.loadingCtrl.dismiss();
                  });
                });
            });
        } else {
          this.firestore.update(coleccion, tempObj).then(() => {
            this.loadingCtrl.dismiss();
          });
        }
      });
    }
  }

  async borrar(formulario: any, coleccion: string) {
    await this.showLoading().then(() => {
      this.firestore.borrar(coleccion, formulario).then(() => {
        this.loadingCtrl.dismiss();
      });
    });
  }

  segmentChanged($event: IonSegmentCustomEvent<SegmentChangeEventDetail>) {
    this.tab = $event.detail.value.toString();
  }

  seleccionarAdmin($event: any) {
    this.usuarioAdmin = $event;
  }
  seleccionarEmpleado($event: any) {
    this.usuarioEmpleado = $event;
  }
  seleccionarCliente($event: any) {
    this.usuarioCliente = $event;
  }
  seleccionarMesa($event: any) {
    this.mesa = $event;
  }
  seleccionarProducto($event: any) {
    this.producto = $event;
  }
}
