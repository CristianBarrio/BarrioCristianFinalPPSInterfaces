import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { FirebaseService } from 'src/app/services/firebase.service';
import { SpotifyService } from 'src/app/services/spotify.service';
import { TemasService } from 'src/app/services/temas.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.page.html',
  styleUrls: ['./main.page.scss'],
  imports: [IonicModule, FormsModule, CommonModule],
  standalone: true
})
export class MainPage implements OnInit {
  nombreArtista: string = '';
  artista: any = null;
  cancionesArtista: any[] = [];
  msgError: string = '';
  temaActual = 'tema-argentina';

  constructor(private spotifyService: SpotifyService, 
    private router: Router, 
    private firebase: FirebaseService,
    private temaSvc: TemasService,
    private utilsSvc: UtilsService
  ) {}

  ngOnInit() {
    this.spotifyService.getToken().subscribe(
      (response) => {
        this.spotifyService.setTokens(response.access_token, response.refresh_token);
      },
      (error) => {
        console.error('Error fetching token:', error);
      }
    );

    this.temaActual = `tema-${this.temaSvc.getTema().toLowerCase()}`;
    this.temaSvc.temaActual$.subscribe(tema => {
      this.temaActual = `tema-${tema.toLowerCase()}`;
    });
  }

  ionViewWillEnter() {
    this.nombreArtista = '';
    this.artista = null;
    this.cancionesArtista = [];
    this.msgError = '';
  }

  confirmarArtista() {
    if (this.cancionesArtista.length < 4) {
      this.msgError = 'El artista no tiene suficientes canciones. Ingresá otro.';
      return;
    }

    const cancionesElegidas = this.cancionesArtista.sort(() => Math.random() - 0.5);

    if(this.temaActual === 'tema-festivo') this.utilsSvc.reproducirSonido('egg-crack1.mp3');
    if(this.temaActual === 'tema-naif') this.utilsSvc.reproducirSonido('marimba.wav');
    if(this.temaActual === 'tema-profesional') this.utilsSvc.reproducirSonido('mechanical.wav');
    if(this.temaActual === 'tema-argentina') this.utilsSvc.reproducirSonido('bandoneon.mp3');

    this.router.navigate(['main/home'], {
      queryParams: {
        artista: this.artista.name,
        canciones: JSON.stringify(cancionesElegidas),
      },
    });
  }

  buscarArtista() {
    if (this.nombreArtista.trim() === '') {
      return;
    }

    this.spotifyService.buscarArtista(this.nombreArtista).subscribe(
      (response) => {
        const artistas = response.artists.items;
        if (artistas.length > 0) {
          this.artista = artistas[0];
          this.cargarTopCanciones();
        } else {
          this.artista = null;
          this.cancionesArtista = [];
          this.msgError = 'No se encontró el artista.';
        }
      },
      (error) => {
        this.msgError = 'Error buscando el artista. Por favor, intentá de nuevo.';
      }
    );
  }

  cargarTopCanciones() {
    const idArtista = this.artista.id;
    this.spotifyService.getTopCanciones(idArtista).subscribe(
      (response) => {
        const topCanciones = response.tracks;

        this.cancionesArtista = Array.from(new Set(topCanciones.map((track) => track.id))).map((id) =>
          topCanciones.find((track) => track.id === id)
        );

        if (this.cancionesArtista.length < 4) {
          this.msgError = 'El artista no tiene suficientes canciones. Ingresá otro.';
        } else {
          this.msgError = '';
        }
      },
      (error) => {
        console.error('Error loading songs:', error);
      }
    );
  }

  signOut(){
    if(this.temaActual === 'tema-festivo') this.utilsSvc.reproducirSonido('Christmas Bells1.mp3');
    if(this.temaActual === 'tema-naif') this.utilsSvc.reproducirSonido('bubbles-popping.wav');
    if(this.temaActual === 'tema-profesional') this.utilsSvc.reproducirSonido('door-close.wav');
    if(this.temaActual === 'tema-argentina') this.utilsSvc.reproducirSonido('tango3.mp3');

    this.firebase.signOut();
  }
}
