import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { TemasService } from './temas.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  router = inject(Router);
  temaSvc = inject(TemasService);

  loading(){
    return this.loadingController.create({spinner:'lines-sharp'});
  }

  async presentToast(opts?:ToastOptions) {
    const toast = await this.toastController.create(opts);
    toast.present();
  }


  routerLink(url:string){
    return this.router.navigateByUrl(url);
  }

  saveInLocalStorage(key:string, value:any){
    return localStorage.setItem(key, JSON.stringify(value));
  }

  getFromLocalStorage(key:string){
    return JSON.parse(localStorage.getItem(key));
  }

  reproducirSonido(archivo:string){
    const audio = new Audio(`/assets/sonidos/${archivo}`);
    audio.play();
  }

  private audio = new Audio();

  play(type: 'usuario' | 'login' | 'confirmar' | 'salir' | 'elegir' | 'victoria' | 'atras') {
      
    const tema = this.temaSvc.getTemaSonidos();

    const soundMap: Record<string, Record<string, string>> = {
      festivo: {
        usuario: 'assets/sonidos/festivo/christmasuser.wav',
        login: 'assets/sonidos/festivo/wolf.wav',
        confirmar: 'assets/sonidos/festivo/egg-crack1.mp3',
        salir: 'assets/sonidos/festivo/Christmas Bells1.mp3',
        elegir: 'assets/sonidos/festivo/soap-bubble.wav',
        victoria: 'assets/sonidos/festivo/fairy-win.wav',
        atras: 'assets/sonidos/festivo/cassette.mp3'
      },
      argentina: {
        usuario: 'assets/sonidos/argentina/mate1.mp3',
        login: 'assets/sonidos/argentina/tango2.mp3',
        confirmar: 'assets/sonidos/argentina/bandoneon.mp3',
        salir: 'assets/sonidos/argentina/tango3.mp3',
        elegir: 'assets/sonidos/argentina/bombo.mp3',
        victoria: 'assets/sonidos/argentina/gol.mp3',
        atras: 'assets/sonidos/argentina/chacarera.mp3'
      },
      profesional: {
        usuario: 'assets/sonidos/profesional/classic-click.wav',
        login: 'assets/sonidos/profesional/quick-notification.wav',
        confirmar: 'assets/sonidos/profesional/mechanical.wav',
        salir: 'assets/sonidos/profesional/door-close.wav',
        elegir: 'assets/sonidos/profesional/pen-click.wav',
        victoria: 'assets/sonidos/profesional/fantasy-game-success.wav',
        atras: 'assets/sonidos/profesional/cassette.mp3'
      },
      naif: {
        usuario: 'assets/sonidos/naif/toy1.wav',
        login: 'assets/sonidos/naif/page.wav',
        confirmar: 'assets/sonidos/naif/marimba.wav',
        salir: 'assets/sonidos/naif/bubbles-popping.wav',
        elegir: 'assets/sonidos/naif/naif-cancion.wav',
        victoria: 'assets/sonidos/naif/wind-chimes.wav',
        atras: 'assets/sonidos/naif/xylophone.wav'
      }
    };

    const src = soundMap[tema]?.[type];
    if (!src) return;

    this.audio.src = src;
    this.audio.currentTime = 0;
    this.audio.play().catch(() => {});
  }

  getIcon(type: 'login' | 'flecha' | 'rejugar' | 'salir' | 'cancion'): string {

    const tema = this.temaSvc.getTemaIconos();

    const iconMap: Record<string, Record<string, string>> = {
      argentina: {
        login: 'assets/argentina/mate.png',
        flecha: 'assets/argentina/obelisk-of-buenos-aires.png',
        rejugar: 'assets/argentina/tango.png',
        salir: 'assets/argentina/medialuna.png',
        cancion: 'assets/argentina/sol-de-mayo.png'
      },
      profesional: {
        login: 'assets/profesional/ink-pen.png',
        flecha: 'assets/profesional/up-chevron1.png',
        rejugar: 'assets/replay.png',
        salir: 'assets/profesional/log-out-outline.png',
        cancion: ''
      },
      naif: {
        login: 'assets/naif/paint-brush.png',
        flecha: 'assets/naif/hot-air-balloon.png',
        rejugar: 'assets/naif/arrow-back.png',
        salir: 'assets/naif/scribble.png',
        cancion: ''
      }
    };

    return iconMap[tema]?.[type] ?? '';
  }
}
