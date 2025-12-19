import { Component, OnInit } from '@angular/core';
import {
  SurveyService,
  Encuesta,
  Pregunta,
} from 'src/app/servicios/survey.service';
import { Router } from '@angular/router';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { ModalController, NavParams } from '@ionic/angular';
import { collection, Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-cargar-encuesta',
  templateUrl: './cargar-encuesta.component.html',
  styleUrls: ['./cargar-encuesta.component.scss'],
})
export class CargarEncuestaComponent implements OnInit {
  encuesta: Encuesta;
  respuestas: any = [];
  usuarioActual = this.navParams.get('usuarioActual');
  allAnswered = false;

  constructor(
    private surveyService: SurveyService,
    private firebase: FirebaseService,
    private modalCtrl: ModalController,
    private navParams: NavParams
  ) {}

  ngOnInit() {
    this.encuesta = this.surveyService.getEncuesta(1);
    this.validarRespuestas();
  }

  validarRespuestas() {
    this.allAnswered = this.encuesta.preguntas
      .filter((p) => p.tipo !== 'texto')
      .every(
        (p) =>
          this.respuestas[p.id] !== undefined && this.respuestas[p.id] !== ''
      );
  }

  onAnswerChange() {
    this.validarRespuestas();
  }

  guardarRespuestas() {
    let coleccion = 'usuarios';
    if (this.usuarioActual.esAnonimo) {
      coleccion = 'usuariosAnonimos';
    }
    const resultados = {
      fecha: Timestamp.fromDate(new Date()),
      respuestas: this.respuestas,
    };
    console.info(resultados);
    //this.surveyService.guardarResultado(this.encuesta.id, resultados);
    
    this.firebase.guardarEncuesta(resultados).then(() => {
      this.usuarioActual.cargoEncuesta = true;
      this.firebase.update(coleccion, this.usuarioActual).then(() => {
        console.log('Respuestas guardadas:', resultados);
        this.cancel();
      });
    });
  }

  cancel() {
    return this.modalCtrl.dismiss(null, 'cancel');
  }
}
