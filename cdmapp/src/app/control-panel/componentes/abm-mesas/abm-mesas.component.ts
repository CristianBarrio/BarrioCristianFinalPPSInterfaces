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
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { FirebaseService } from '../../servicios/firebase.service';

@Component({
  selector: 'app-abm-mesas',
  templateUrl: './abm-mesas.component.html',
  styleUrls: ['./abm-mesas.component.scss'],
})
export class ABMMesasComponent implements OnInit, OnChanges {
  @Input() inputMesa: any;
  @Output() guardar = new EventEmitter<any>();
  @Output() update = new EventEmitter<any>();
  @Output() borrar = new EventEmitter<any>();
  @Output() cancelar = new EventEmitter<any>();

  formularioMesa: FormGroup;
  formularioModificar: FormGroup;

  //foto
  imagePreview: any =
    'https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png';
  imagePreviewModificar: any =
    'https://cdn1.iconfinder.com/data/icons/user-interface-664/24/User-512.png';
  fotoFile: File | null = null;
  //

  constructor(private fb: FormBuilder, private auth: FirebaseService) {
    this.formularioMesa = this.fb.group({
      numero: [1, [Validators.required]],
      capacidad: [
        4,
        [Validators.required, Validators.min(2), Validators.max(8)],
      ],
      tipo: ['estándar', [Validators.required]],
      estado: ['libre', [Validators.required]],
      foto: [
        'https://media-cdn.tripadvisor.com/media/photo-s/0a/75/cc/72/table-for-two-restaurant.jpg',
        [],
      ],
      fotoFile: [null, [Validators.required]],
    });
    this.formularioModificar = this.fb.group({
      numero: [1, [Validators.required]],
      capacidad: [
        4,
        [Validators.required, Validators.min(2), Validators.max(8)],
      ],
      tipo: ['estándar', [Validators.required]],
      estado: ['libre', [Validators.required]],
      foto: [
        'https://media-cdn.tripadvisor.com/media/photo-s/0a/75/cc/72/table-for-two-restaurant.jpg',
        [Validators.required],
      ],
    });
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (this.inputMesa != null) {
      this.inputMesa = changes['inputMesa'].currentValue;
      this.formularioModificar.controls['numero'].setValue(
        this.inputMesa.numero
      );
      this.formularioModificar.controls['capacidad'].setValue(
        this.inputMesa.capacidad
      );
      this.formularioModificar.controls['tipo'].setValue(this.inputMesa.tipo);
      this.formularioModificar.controls['estado'].setValue(
        this.inputMesa.estado
      );
      this.formularioModificar.controls['foto'].setValue(this.inputMesa.foto);
      this.imagePreviewModificar = this.inputMesa.foto;
    }
  }

  onSubmit(formulario) {
    this.guardar.emit(formulario);
    this.formularioMesa.reset();
    this.imagePreview = null;
  }

  cancelarSeleccion() {
    this.cancelar.emit(null);
  }

  borrarMesa() {
    this.borrar.emit(this.inputMesa);
    this.cancelarSeleccion();
  }

  updateMesa(formulario) {
    this.inputMesa.numero = this.formularioModificar.get('numero').value;
    this.inputMesa.capacidad = this.formularioModificar.get('capacidad').value;
    this.inputMesa.tipo = this.formularioModificar.get('tipo').value;
    this.inputMesa.estado = this.formularioModificar.get('estado').value;
    this.inputMesa.foto = this.formularioModificar.get('foto').value;
    if (this.formularioModificar.get('fotoFile'))
      this.inputMesa.fotoFile = this.formularioModificar.get('fotoFile').value;
    this.update.emit(this.inputMesa);
    this.cancelarSeleccion();
    //this.cancelar.emit(null);
  }

  //Foto
  async nuevaFoto() {
    await this.auth.tomarFoto().then((resultado) => {
      //console.info(resultado);
      this.imagePreview = resultado.webPath;
      this.auth.readAsBase64(resultado).then((blob) => {
        this.fotoFile = blob;
        this.formularioMesa.controls['fotoFile'].setValue(blob);
      });
    });
  }

  async nuevaFotoModificar() {
    this.formularioModificar.addControl(
      'fotoFile',
      new FormControl(null, Validators.required)
    );
    await this.auth.tomarFoto().then((resultado) => {
      //console.info(resultado);
      this.imagePreviewModificar = resultado.webPath;
      this.auth.readAsBase64(resultado).then((blob) => {
        this.fotoFile = blob;
        this.formularioModificar.controls['fotoFile'].setValue(blob);
      });
    });
  }
}
