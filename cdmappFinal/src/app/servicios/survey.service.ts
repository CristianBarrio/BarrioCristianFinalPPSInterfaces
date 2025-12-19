import { Injectable } from '@angular/core';

export interface Encuesta {
  id: number;
  titulo: string;
  preguntas: Pregunta[];
}

export interface Pregunta {
  id: number;
  texto: string;
  tipo: 'texto' | 'multiple-choice';
  opciones?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class SurveyService {

  private encuestas: Encuesta[] = [
    {
      id: 1,
      titulo: 'Encuesta de Satisfacción',
      preguntas: [
        { id: 0, texto: 'Atención del personal', tipo: 'multiple-choice', opciones: ['Excelente', 'Buena', 'Regular', 'Mala'] },
        { id: 1, texto: 'Velocidad', tipo: 'multiple-choice', opciones: ['Muy rápido', 'Rápido', 'Según lo estimado', 'Lento', 'Muy lento'] },
        { id: 2, texto: 'Precios', tipo: 'multiple-choice', opciones: ['$', '$$', '$$$', '$$$$'] },
        { id: 3, texto: 'Comentarios adicionales (opcional)', tipo: 'texto' }
      ]
    }
  ];

  getEncuestas() {
    return [...this.encuestas];
  }

  getEncuesta(id: number) {
    return { ...this.encuestas.find(encuesta => encuesta.id === id) };
  }

  guardarResultado(encuestaId: number, results: any) {
    const formatearResultados = this.formatearResultadosParaGrafico(results);
    localStorage.setItem(`encuesta_${encuestaId}`, JSON.stringify(formatearResultados));
  }

  getResultado(encuestaId: number) {
    const result = localStorage.getItem(`encuesta_${encuestaId}`);
    return result ? JSON.parse(result) : null;
  }

  private formatearResultadosParaGrafico(results: any) {
    const formateado: any = {};

    for (const preguntaId in results) {
      const pregunta = this.encuestas[0].preguntas.find(p => p.id === +preguntaId);
      if (pregunta) {
        if (pregunta.tipo === 'multiple-choice') {
          if (!formateado[preguntaId]) {
            formateado[preguntaId] = { opciones: pregunta.opciones, respuestas: new Array(pregunta.opciones.length).fill(0) };
          }
          const index = pregunta.opciones.indexOf(results[preguntaId]);
          if (index !== -1) {
            formateado[preguntaId].respuestas[index]++;
          }
        } else if (pregunta.tipo === 'texto') {
          if (!formateado[preguntaId]) {
            formateado[preguntaId] = [];
          }
          formateado[preguntaId].push(results[preguntaId]);
        }
      }
    }

    return formateado;
  }
}
