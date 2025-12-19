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
  selector: 'app-abm-empleados',
  templateUrl: './abm-empleados.component.html',
  styleUrls: ['./abm-empleados.component.scss'],
})
export class ABMEmpleadosComponent implements OnInit, OnChanges {
  @Input() inputEmpleado: any;
  @Output() guardar = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() borrar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  formularioEmpleados: FormGroup;
  formularioModificar: FormGroup;

  //foto
  imagePreview: any =
    'https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png';
  imagePreviewModificar: any =
    'https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png';
  fotoFile: File | null = null;
  //

  constructor(private fb: FormBuilder, private auth: FirebaseService) {
    this.formularioEmpleados = this.fb.group({
      nombre: ['AAAAAA', [Validators.required]],
      apellido: ['BBBBB', Validators.required],
      correo: ['sdsdkm@gmail.com', [Validators.required, Validators.email]],
      password: ['111111', Validators.required],
      dni: [
        2323232,
        [
          Validators.required,
          Validators.min(1000000),
          Validators.max(99999999),
        ],
      ],
      cuil: ['20-2323232-0', [Validators.required]],
      perfil: ['empleado', [Validators.required]],
      tipo: ['mozo', [Validators.required]],
      foto: [
        'https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png',
        [],
      ],
      fotoFile: [null, [Validators.required]],
    });
    this.formularioModificar = this.fb.group({
      nombre: ['AAAAAA', [Validators.required]],
      apellido: ['BBBBB', Validators.required],
      correo: ['sdsdkm@gmail.com', [Validators.required, Validators.email]],
      password: ['111111', Validators.required],
      dni: [
        2323232,
        [
          Validators.required,
          Validators.min(1000000),
          Validators.max(99999999),
        ],
      ],
      cuil: ['20-2323232-0', [Validators.required]],
      perfil: ['empleado', [Validators.required]],
      tipo: ['mozo', [Validators.required]],
      foto: [
        'https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png',
        [Validators.required],
      ],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputEmpleado != null) {
      this.inputEmpleado = changes['inputEmpleado'].currentValue;
      this.formularioModificar.controls['nombre'].setValue(
        this.inputEmpleado.nombre
      );
      this.formularioModificar.controls['apellido'].setValue(
        this.inputEmpleado.apellido
      );
      this.formularioModificar.controls['correo'].setValue(
        this.inputEmpleado.correo
      );
      this.formularioModificar.controls['password'].setValue(
        this.inputEmpleado.password
      );
      this.formularioModificar.controls['dni'].setValue(this.inputEmpleado.dni);
      this.formularioModificar.controls['cuil'].setValue(
        this.inputEmpleado.cuil
      );
      this.formularioModificar.controls['perfil'].setValue(
        this.inputEmpleado.perfil
      );
      this.formularioModificar.controls['tipo'].setValue(
        this.inputEmpleado.tipo
      );
      this.formularioModificar.controls['foto'].setValue(
        this.inputEmpleado.foto
      );
      this.imagePreviewModificar = this.inputEmpleado.foto;
    }
  }

  onSubmit(formulario) {
    this.guardar.emit(formulario);
    this.formularioEmpleados.reset({perfil:'empleado'});
    this.imagePreview = null;
  }

  cancelarSeleccion() {
    this.cancelar.emit(null);
  }

  borrarUsuario() {
    this.borrar.emit(this.inputEmpleado);
    this.cancelarSeleccion();
  }

  updateUsuario(formulario) {
    this.inputEmpleado.nombre = this.formularioModificar.get('nombre').value;
    this.inputEmpleado.apellido =
      this.formularioModificar.get('apellido').value;
    this.inputEmpleado.correo = this.formularioModificar.get('correo').value;
    this.inputEmpleado.password =
      this.formularioModificar.get('password').value;
    this.inputEmpleado.dni = this.formularioModificar.get('dni').value;
    this.inputEmpleado.cuil = this.formularioModificar.get('cuil').value;
    this.inputEmpleado.perfil = this.formularioModificar.get('perfil').value;
    this.inputEmpleado.tipo = this.formularioModificar.get('tipo').value;
    if (this.formularioModificar.get('fotoFile'))
      this.inputEmpleado.fotoFile = this.formularioModificar.get('fotoFile').value;
    this.update.emit(this.inputEmpleado);
    this.cancelarSeleccion();
    //this.cancelar.emit(null);
  }

        //Foto
    async nuevaFoto(){
    await this.auth.tomarFoto().then((resultado) =>{
      //console.info(resultado);
      this.imagePreview = resultado.webPath;
      this.auth.readAsBase64(resultado).then(blob =>{
        this.fotoFile = blob;
        this.formularioEmpleados.controls['fotoFile'].setValue(blob);
      })
      })
  }

    async nuevaFotoModificar(){
      this.formularioModificar.addControl('fotoFile', new FormControl(null, Validators.required))
    await this.auth.tomarFoto().then((resultado) =>{
      //console.info(resultado);
      this.imagePreviewModificar = resultado.webPath;
      this.auth.readAsBase64(resultado).then(blob =>{
        this.fotoFile = blob;
        this.formularioModificar.controls['fotoFile'].setValue(blob);
      })
      })
  }

}
