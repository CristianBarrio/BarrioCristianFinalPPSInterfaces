/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';

@Component({
  selector: 'app-abm-productos',
  templateUrl: './abm-productos.component.html',
  styleUrls: ['./abm-productos.component.scss'],
})
export class ABMProductosComponent implements OnInit, OnChanges {
  @Input() inputProductos: any;
  @Output() guardar = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() borrar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  formularioProductos: FormGroup;
  formularioModificar: FormGroup;

  //foto
  imagePreview: any = [];
  imagePreviewModificar: any = [];
  fotoFile: File[] = [];
  //

  constructor(private fb: FormBuilder, private auth: FirebaseService) {
    this.formularioProductos = this.fb.group({
      nombre: ['Milanesa', [Validators.required]],
      descripcion: ['Descripción del plato', [Validators.required]],
      tiempoPreparacion: [30, [Validators.required]],
      precio: [1499.99, [Validators.required]],
      tipo: ['plato', [Validators.required]],
      fotos: [[], []],
      fotosFile: [null, [Validators.required]],
    });
    this.formularioModificar = this.fb.group({
      nombre: ['Milanesa', [Validators.required]],
      descripcion: ['Descripción del plato', [Validators.required]],
      tiempoPreparacion: [30, [Validators.required]],
      precio: [1499.99, [Validators.required]],
      tipo: ['plato', [Validators.required]],
      fotos: [[], []],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputProductos != null) {
      this.inputProductos = changes['inputProductos'].currentValue;
      this.formularioModificar.controls['nombre'].setValue(
        this.inputProductos.nombre
      );
      this.formularioModificar.controls['descripcion'].setValue(
        this.inputProductos.descripcion
      );
      this.formularioModificar.controls['tiempoPreparacion'].setValue(
        this.inputProductos.tiempoPreparacion
      );
      this.formularioModificar.controls['precio'].setValue(
        this.inputProductos.precio
      );
      this.formularioModificar.controls['tipo'].setValue(
        this.inputProductos.tipo
      );
      this.formularioModificar.controls['fotos'].setValue(
        this.inputProductos.fotos
      );
      this.imagePreviewModificar = this.inputProductos.fotos;

    }
  }

  onSubmit(formulario) {
    this.guardar.emit(formulario);
    this.formularioProductos.reset({fotos:[]});
    this.imagePreview = [];
  }

  cancelarSeleccion() {
    this.cancelar.emit(null);
  }

  borrarProducto() {
    this.borrar.emit(this.inputProductos);
    this.cancelarSeleccion();
  }

  updateProducto(formulario) {
    this.inputProductos.nombre = this.formularioModificar.get('nombre').value;
    this.inputProductos.descripcion = this.formularioModificar.get('descripcion').value;
    this.inputProductos.tiempoPreparacion = this.formularioModificar.get('tiempoPreparacion').value;
    this.inputProductos.precio = this.formularioModificar.get('precio').value;
    this.inputProductos.tipo = this.formularioModificar.get('tipo').value;
    this.inputProductos.fotos = this.formularioModificar.get('fotos').value;
    if (this.formularioModificar.get('fotosFile')){
      this.inputProductos.fotos = [];
      this.inputProductos.fotosFile = this.formularioModificar.get('fotosFile').value;
    }
    this.update.emit(this.inputProductos);
    this.cancelarSeleccion();
    //this.cancelar.emit(null);
  }

  //Foto
  async nuevasFotos() {
    this.fotoFile = [];
    this.imagePreview = [];
    for (let index = 0; index < 3; index++) {
    await this.auth.tomarFoto().then((resultado) => {
      //console.info(resultado);
      this.imagePreview.push(resultado.webPath);
      this.auth.readAsBase64(resultado).then((blob) => {
        this.fotoFile.push(blob);
      });
    });
    }
    this.formularioProductos.controls['fotosFile'].setValue(this.fotoFile);
    //console.info(this.fotoFile);
    //console.info(this.imagePreview)
  }


  async nuevasFotosModificar() {
    this.fotoFile = [];
    this.imagePreviewModificar = [];
    this.formularioModificar.addControl(
      'fotosFile',
      new FormControl(null, Validators.required)
    );
    for (let index = 0; index < 3; index++) {
    await this.auth.tomarFoto().then((resultado) => {
      //console.info(resultado);
      this.imagePreviewModificar.push(resultado.webPath);
      this.auth.readAsBase64(resultado).then((blob) => {
        this.fotoFile.push(blob);
      });
    });
    this.formularioModificar.controls['fotosFile'].setValue(this.fotoFile);
    }
  }
}
