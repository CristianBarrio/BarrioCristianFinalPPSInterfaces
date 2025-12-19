/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { SurveyService } from 'src/app/servicios/survey.service';
import { Chart } from 'angular-highcharts';
import { FirebaseService } from 'src/app/servicios/firebase.service';
import { take } from 'rxjs';
import { TemasService } from 'src/app/servicios/temas.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-encuestas',
  templateUrl: './encuestas.component.html',
  styleUrls: ['./encuestas.component.scss'],
})
export class EncuestasComponent implements OnInit {
  @ViewChild('myCanvas') canvasRef: ElementRef;
  encuestasFire = this.firebase.traerColeccion('encuestas', {});

  encuestaId = 1;
  resultados: any;
  comentarios: any = [];
  selectedSegment: string = 'torta';
  arrayEncuestas: any;

  optionsPie: any = {
    accessibility: {
      enabled: false,
    },
    chart: {
      type: 'pie',
    },
    title: {
      text: 'Servicio',
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        borderWidth: 2,
        cursor: 'pointer',
        dataLabels: {
          enabled: true,
          format:
            '<b>{point.name}</b><br>Cant: {point.y}<br>{point.percentage:.2f}%',
          distance: 20,
        },
      },
    },
    series: [
      {
        name: 'Turnos',
        colorByPoint: true,
        data: [],
      },
    ],
  };

  optionsBar: any = {
    chart: {
      type: 'column',
    },
    title: {
      text: 'Velocidad',
      align: 'left',
    },
    xAxis: {
      categories: [
        'Muy rápido',
        'Rápido',
        'Según lo estimado',
        'Lento',
        'Muy lento',
      ],
      crosshair: true,
      accessibility: {
        description: '',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: '',
      },
    },
    tooltip: {
      valueSuffix: ' (1000 MT)',
    },
    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: [],
  };

  optionsLine: any = {
    chart: {
      type: 'line',
    },
    title: {
      text: 'Precios',
    },
    xAxis: {
      categories: ['$', '$$', '$$$', '$$$$'],
    },
    yAxis: {
      title: {
        text: 'Cant. opiniones',
      },
    },
    plotOptions: {
      line: {
        dataLabels: {
          enabled: true,
        },
        enableMouseTracking: false,
      },
    },
    series: [],
  };

  chartPie!: Chart;
  chartBar!: Chart;
  chartLine!: Chart;

  btnElegido: string | null = 'torta';

  elegirBoton(value: string) {
    this.btnElegido = value;
    this.utilsSvc.play('usuario');
    this.segmentChanged({ detail: { value } });
  }

  constructor(private firebase: FirebaseService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.graficoTorta();
    this.graficoBarra();
    this.graficoLinea();
    this.extractComentarios();
  }

  graficoTorta() {
    this.optionsPie.series[0].data = [];
    let resultadosEncuesta = ['Excelente', 'Buena', 'Regular', 'Mala'];
    let respuestas = [];
    this.resultados = this.firebase
      .traerColeccion('encuestas', {})
      .subscribe((response) => {
        this.arrayEncuestas = response;
        this.arrayEncuestas.forEach((element) => {
          respuestas.push(element.respuestas[0]);
        });
        resultadosEncuesta.forEach((element: any) => {
          let item = { name: element, y: 0 };
          item.y = respuestas.filter((res: any) => res === item.name).length;
          if (item.y > 0) this.optionsPie.series[0].data.push(item);
        });
        this.chartPie = new Chart(this.optionsPie);
      });
  }

  graficoBarra(): void {
    //this.chartBar = new Chart(this.optionsBar);
    let resultadosEncuesta = [
      'Muy rápido',
      'Rápido',
      'Según lo estimado',
      'Lento',
      'Muy lento',
    ];
    let respuestas = [];
    this.resultados = this.firebase
      .traerColeccion('encuestas', {})
      .subscribe((response) => {
        this.arrayEncuestas = response;
        this.arrayEncuestas.forEach((element) => {
          respuestas.push(element.respuestas[1]);
        });
        let item = [{ name: 'Velocidad', data: [] }];
        resultadosEncuesta.forEach((element: any) => {
          item[0].data.push(
            respuestas.filter((res: any) => res === element).length
          );
        });
        this.optionsBar.series = item;
        console.info(item);
        console.info(this.optionsBar);
        this.chartBar = new Chart(this.optionsBar);
      });
  }

  graficoLinea(): void {
    //this.chartLine = new Chart(this.optionsLine);

    let resultadosEncuesta = ['$', '$$', '$$$', '$$$$'];
    let respuestas = [];
    this.resultados = this.firebase
      .traerColeccion('encuestas', {})
      .subscribe((response) => {
        this.arrayEncuestas = response;
        this.arrayEncuestas.forEach((element) => {
          respuestas.push(element.respuestas[2]);
        });
        let item = [{ name: 'Precio', data: [] }];
        resultadosEncuesta.forEach((element: any) => {
          item[0].data.push(
            respuestas.filter((res: any) => res === element).length
          );
        });
        this.optionsLine.series = item;
        console.info(item);
        console.info(this.optionsLine);
        this.chartLine = new Chart(this.optionsLine);
      });
  }

  extractComentarios() {
    let respuestas = [];
    this.resultados = this.firebase
      .traerColeccion('encuestas', {})
      .subscribe((response) => {
        this.arrayEncuestas = response;
        this.arrayEncuestas.forEach((element) => {
          let item = {fecha:element.fecha, mensaje:element.respuestas[3]};
          respuestas.push(item);
        });
      });
    this.comentarios = respuestas || [];
  }

  segmentChanged(eventOrValue: any) {
    this.selectedSegment = eventOrValue?.detail?.value ?? eventOrValue;
    
    this.graficoTorta();
    this.graficoBarra();
    this.graficoLinea();
  }

}
