import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { TemasService } from 'src/app/services/temas.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CambiarTemasComponent } from 'src/app/shared/components/cambiar-temas/cambiar-temas.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true
})
export class HomePage implements OnInit {
  artista: string = '';
  pilaCanciones: any[] = [];
  cancionesEliminadas: any[] = [];
  cancionesActuales: any[] = [];
  ganadora: any = null;
  temaActual = 'argentina';

  constructor(
    private router: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private firebase: FirebaseService,
    private temaSvc: TemasService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.router.queryParams.subscribe((params) => {
      if (params && params['artista'] && params['canciones']) {
        this.artista = params['artista'];
        this.pilaCanciones = this.shuffleArray(JSON.parse(params['canciones']));
        this.cargarNuevoPar();
      }
    });

    this.temaActual = `tema-${this.temaSvc.getTema().toLowerCase()}`;
    this.temaSvc.temaActual$.subscribe(tema => {
      this.temaActual = `tema-${tema.toLowerCase()}`;
    });
  }

  shuffleArray(array: any[]): any[] {
    return array.sort(() => Math.random() - 0.5);
  }

  cargarNuevoPar() {
    if (this.pilaCanciones.length > 1 && this.cancionesActuales.length === 0) {
      this.cancionesActuales = this.pilaCanciones.splice(0, 2);
    } else if (this.pilaCanciones.length > 0) {
      const proximaCancion = this.pilaCanciones.splice(0, 1)[0];
      this.cancionesActuales[1] = proximaCancion;
    } else if (this.cancionesActuales.length === 1) {
      this.ganadora = this.cancionesActuales[0];
    }
  }

  elegirCancion(cancionSeleccionada: any) {
    if(this.temaActual === 'tema-festivo') this.utilsSvc.reproducirSonido('soap bubble.wav');
    if(this.temaActual === 'tema-profesional') this.utilsSvc.reproducirSonido('pen-click.wav');
    if(this.temaActual === 'tema-naif') this.utilsSvc.reproducirSonido('naif-cancion.wav');
    if(this.temaActual === 'tema-argentina') this.utilsSvc.reproducirSonido('bombo.mp3');
    
    const cancionEliminada =
      this.cancionesActuales[0] === cancionSeleccionada
        ? this.cancionesActuales[1]
        : this.cancionesActuales[0];
  
    this.cancionesEliminadas.push(cancionEliminada);
  
    if (this.cancionesActuales[0] === cancionSeleccionada) {
      this.cancionesActuales[1] = this.pilaCanciones.length > 0 ? this.pilaCanciones.splice(0, 1)[0] : null;
    } else {
      this.cancionesActuales[0] = this.pilaCanciones.length > 0 ? this.pilaCanciones.splice(0, 1)[0] : null;
    }
  
    if (!this.cancionesActuales[0] || !this.cancionesActuales[1]) {
      this.ganadora = cancionSeleccionada;
      this.cancionesActuales = [];
      this.cdr.detectChanges();

      if(this.temaActual === 'tema-naif') this.utilsSvc.reproducirSonido('fairy-win.wav');
      if(this.temaActual === 'tema-festivo') this.utilsSvc.reproducirSonido('wind-chimes.wav');
      if(this.temaActual === 'tema-profesional') this.utilsSvc.reproducirSonido('fantasy-game-success.wav');
      if(this.temaActual === 'tema-argentina') this.utilsSvc.reproducirSonido('gol.mp3');
      return;
    }
  
    if (!this.cancionesActuales[0]) {
      this.cancionesActuales[0] = cancionSeleccionada;
    } else if (!this.cancionesActuales[1]) {
      this.cancionesActuales[1] = cancionSeleccionada;
    }
  }

  jugarDeNuevo(){
    if(this.temaActual === 'tema-festivo') this.utilsSvc.reproducirSonido('Jingle Halloween1.mp3');
    if(this.temaActual === 'tema-naif') this.utilsSvc.reproducirSonido('xylophone.wav');
    if(this.temaActual === 'tema-profesional') this.utilsSvc.reproducirSonido('cassette.mp3');
    if(this.temaActual === 'tema-argentina') this.utilsSvc.reproducirSonido('chacarera.mp3');
    
    this.utilsSvc.routerLink('main');
  }
  
  signOut(){
    if(this.temaActual === 'tema-festivo') this.utilsSvc.reproducirSonido('Christmas Bells1.mp3');
    if(this.temaActual === 'tema-naif') this.utilsSvc.reproducirSonido('bubbles-popping.wav');
    if(this.temaActual === 'tema-profesional') this.utilsSvc.reproducirSonido('door-close.wav');
    if(this.temaActual === 'tema-argentina') this.utilsSvc.reproducirSonido('tango3.mp3');

    this.firebase.signOut();
  }
}
