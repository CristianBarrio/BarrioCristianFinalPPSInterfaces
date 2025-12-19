import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController, ToastOptions } from '@ionic/angular';
import { TemasService } from './temas.service';
import emailjs, { EmailJSResponseStatus } from 'emailjs-com';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  loadingController = inject(LoadingController);
  toastController = inject(ToastController);
  router = inject(Router);
  temasSvc = inject(TemasService);

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

  private audio = new Audio();

  play(type: 'usuario' | 'login' | 'confirmar' | 'salir' | 'elegir' | 'victoria' | 'atras') {
    const tema = this.temasSvc.getTema();

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
        atras: 'assets/sonidos/naif/cassette.mp3'
      }
    };

    const src = soundMap[tema]?.[type];
    if (!src) return;

    this.audio.src = src;
    this.audio.currentTime = 0;
    this.audio.play().catch(() => {});
  }

  enviarMail(mail: string, nombre: string, aceptacion: boolean) {
    const templateId = aceptacion
      ? 'template_zrwsxgk'
      : 'template_l13014h';

    const templateParams = {
      email: mail,
      nombreUsuario: nombre
    };

    emailjs
      .send(
        'service_oyyh8fl', 
        templateId,
        templateParams,
        'TOSgRyOfj_XaUlWSU' 
      )
      .then(
        (response: EmailJSResponseStatus) => {
          console.log('SUCCESS!', response.status, response.text);
        },
        (err) => {
          console.error('FAILED...', err);
        }
      );
  }
}
