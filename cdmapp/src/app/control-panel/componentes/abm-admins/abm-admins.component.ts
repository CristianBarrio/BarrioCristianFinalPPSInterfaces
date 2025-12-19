/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { FirebaseService } from "../../servicios/firebase.service";
import { Timestamp } from "firebase/firestore";

@Component({
  selector: 'app-abm-admins',
  templateUrl: './abm-admins.component.html',
  styleUrls: ['./abm-admins.component.scss'],
})
export class ABMAdminsComponent  implements OnInit, OnChanges {
  @Input() inputAdmin: any;
  @Output() guardar = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() borrar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  formularioOwner: FormGroup;
  formularioOwnerModificar : FormGroup;

  //foto
  imagePreview:any = "https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png";
  imagePreviewModificar:any = "https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png";
  fotoFile:File|null = null;
  //

  constructor(private fb: FormBuilder, private auth: FirebaseService) {
      this.formularioOwner = this.fb.group({
      'nombre': [null, [Validators.required]],
      'apellido': [null, Validators.required],
      'correo': [null, [Validators.required, Validators.email]],
      'password': [null, Validators.required],
      'dni': [null, [Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'cuil': [null, [Validators.required]],
      'perfil': [null, [Validators.required]],
      'tipo': ['admin', [Validators.required]],
      'foto': ['https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png', []],
      'fotoFile': [null, [Validators.required]],
    });
      this.formularioOwnerModificar = this.fb.group({
      'nombre': [,[Validators.required]],
      'apellido': [,Validators.required],
      'correo': [,[Validators.required, Validators.email]],
      'password': [,Validators.required],
      'dni': [,[Validators.required, Validators.min(1000000), Validators.max(99999999)]],
      'cuil': [,[Validators.required]],
      'perfil': [,[Validators.required]],
      'tipo': ['admin', [Validators.required]],
      'foto': [,[Validators.required]],
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(this.inputAdmin != null){
      this.inputAdmin = changes["inputAdmin"].currentValue;
      this.formularioOwnerModificar.controls['nombre'].setValue(this.inputAdmin.nombre);
      this.formularioOwnerModificar.controls['apellido'].setValue(this.inputAdmin.apellido);
      this.formularioOwnerModificar.controls['correo'].setValue(this.inputAdmin.correo);
      this.formularioOwnerModificar.controls['password'].setValue(this.inputAdmin.password);
      this.formularioOwnerModificar.controls['dni'].setValue(this.inputAdmin.dni);
      this.formularioOwnerModificar.controls['cuil'].setValue(this.inputAdmin.cuil);
      this.formularioOwnerModificar.controls['perfil'].setValue(this.inputAdmin.perfil);
      this.formularioOwnerModificar.controls['tipo'].setValue(this.inputAdmin.tipo);
      this.formularioOwnerModificar.controls['foto'].setValue(this.inputAdmin.foto);
      this.imagePreviewModificar = this.inputAdmin.foto;
    }
  }
  
  ngOnInit(): void {
  }

  onSubmit(formulario) {
    //onsole.info(formulario);
    this.guardar.emit(formulario);
    this.formularioOwner.reset();
    this.imagePreview = null;
  }

  cancelarSeleccion(){
    this.cancelar.emit(null);
  }

  borrarUsuario(){
    this.borrar.emit(this.inputAdmin);
    this.cancelarSeleccion();
  }

  updateUsuario(formulario){
    this.inputAdmin.nombre = this.formularioOwnerModificar.get('nombre').value;
    this.inputAdmin.apellido = this.formularioOwnerModificar.get('apellido').value;
    this.inputAdmin.correo = this.formularioOwnerModificar.get('correo').value;
    this.inputAdmin.password = this.formularioOwnerModificar.get('password').value;
    this.inputAdmin.dni = this.formularioOwnerModificar.get('dni').value;
    this.inputAdmin.cuil = this.formularioOwnerModificar.get('cuil').value;
    this.inputAdmin.perfil = this.formularioOwnerModificar.get('perfil').value;
    if(this.formularioOwnerModificar.get('fotoFile'))
      this.inputAdmin.fotoFile = this.formularioOwnerModificar.get('fotoFile').value;
    this.update.emit(this.inputAdmin);
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
        this.formularioOwner.controls['fotoFile'].setValue(blob);
      })
      })
  }

    async nuevaFotoModificar(){
      this.formularioOwnerModificar.addControl('fotoFile', new FormControl(null, Validators.required))
    await this.auth.tomarFoto().then((resultado) =>{
      //console.info(resultado);
      this.imagePreviewModificar = resultado.webPath;
      this.auth.readAsBase64(resultado).then(blob =>{
        this.fotoFile = blob;
        this.formularioOwnerModificar.controls['fotoFile'].setValue(blob);
      })
      })
  }

}
