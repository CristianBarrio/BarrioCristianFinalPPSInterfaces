/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FirebaseService } from "../../servicios/firebase.service";

@Component({
  selector: 'app-abm-clientes',
  templateUrl: './abm-clientes.component.html',
  styleUrls: ['./abm-clientes.component.scss'],
})
export class ABMClientesComponent  implements OnInit, OnChanges {
  @Input() inputCliente: any;
  @Output() guardar = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() borrar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  formularioClientes: FormGroup;
  formularioModificar: FormGroup;

    //foto
  imagePreview:any = "https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png";
  imagePreviewModificar:any = "https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png";
  fotoFile:File|null = null;
  //

  constructor(private fb: FormBuilder, private auth: FirebaseService) {
      this.formularioClientes = this.fb.group({
      'nombre': ['AAAAAA', [Validators.required]],
      'apellido': ['BBBBB', Validators.required],
      'correo': ['sdsdkm@gmail.com', [Validators.required, Validators.email]],
      'password': ['111111', Validators.required],
      'dni': [2323232, [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'perfil': ['cliente', [Validators.required]],
      'estado': ['pendiente', [Validators.required]],
      'foto': ['https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png', []],
      'fotoFile': [null, [Validators.required]],
    });
      this.formularioModificar = this.fb.group({
      'nombre': [, [Validators.required]],
      'apellido': [, Validators.required],
      'correo': [, [Validators.required, Validators.email]],
      'password': [, Validators.required],
      'dni': [, [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'perfil': [, [Validators.required]],
      'estado': ['pendiente', [Validators.required]],
      'foto': [, [Validators.required]],
    });
  }

    ngOnInit(): void {
  }

    ngOnChanges(changes: SimpleChanges): void {
    if(this.inputCliente != null){
      this.inputCliente = changes["inputCliente"].currentValue;
      this.formularioModificar.controls['nombre'].setValue(this.inputCliente.nombre);
      this.formularioModificar.controls['apellido'].setValue(this.inputCliente.apellido);
      this.formularioModificar.controls['correo'].setValue(this.inputCliente.correo);
      this.formularioModificar.controls['password'].setValue(this.inputCliente.password);
      this.formularioModificar.controls['dni'].setValue(this.inputCliente.dni);
      this.formularioModificar.controls['perfil'].setValue(this.inputCliente.perfil);
      this.formularioModificar.controls['foto'].setValue(this.inputCliente.foto);
      this.imagePreviewModificar = this.inputCliente.foto;
    }
  
  }

  onSubmit(formulario) {
    this.guardar.emit(formulario)
    this.formularioClientes.reset({perfil:'cliente', estado:'pendiente'});
    this.imagePreview = null;
  }

  cancelarSeleccion(){
    this.cancelar.emit(null);
  }

  borrarUsuario(){
    this.borrar.emit(this.inputCliente);
    this.cancelarSeleccion();
  }


    updateUsuario(formulario){
    this.inputCliente.nombre = this.formularioModificar.get('nombre').value;
    this.inputCliente.apellido = this.formularioModificar.get('apellido').value;
    this.inputCliente.correo = this.formularioModificar.get('correo').value;
    this.inputCliente.password = this.formularioModificar.get('password').value;
    this.inputCliente.dni = this.formularioModificar.get('dni').value;
    this.inputCliente.perfil = this.formularioModificar.get('perfil').value;
    if(this.formularioModificar.get('fotoFile'))
      this.inputCliente.fotoFile = this.formularioModificar.get('fotoFile').value;
    this.update.emit(this.inputCliente);
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
        this.formularioClientes.controls['fotoFile'].setValue(blob);
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
