import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { TemasService } from 'src/app/services/temas.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-cambiar-temas',
  templateUrl: './cambiar-temas.component.html',
  styleUrls: ['./cambiar-temas.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class CambiarTemasComponent {
  utilsSvc = inject(UtilsService);
  router = inject(Router);

  esSplash = false;

  temas = [
    { name: 'festivo', icon: 'assets/custom/confetti2.png' },
    { name: 'argentina', icon: 'assets/argentina/argentina.png' },
    { name: 'profesional', icon: 'assets/profesional/briefcase (1).png' },
    { name: 'naif', icon: 'assets/naif/paint2.png' }
  ];
  temaActual: string = 'tema-argentina';
  actualIcon: string = 'assets/argentina/argentina.png';
  colorToast: string = 'primary';
  
  constructor(private temaSvc: TemasService) {
    this.temaSvc.temaActual$.subscribe(tema => {
      this.temaActual = tema;
    });

    this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      const url = event.urlAfterRedirects;

      this.esSplash =
        url.includes('splash');
    }
  });
  }
  
  cambiarTema(tema:string) {

    switch (tema) {
      case 'festivo':
        this.colorToast = 'danger';
        break;
      case 'argentina':
        this.colorToast = 'warning';
        break;
      case 'profesional':
        this.colorToast = 'dark';
        break;
      case 'naif':
        this.colorToast = 'tertiary';
        break;
    }

    this.temaSvc.setTema(tema);

    document.body.className = `tema-${tema}`;

    this.actualIcon = this.temas.find(t => t.name === tema)?.icon || 'assets/images-outline.svg';
    this.utilsSvc.presentToast({
      message: `Tema ${tema}`,
      duration: 2000,
      color: this.colorToast,
      position: 'bottom',
      icon: 'color-palette-outline',
      
      cssClass: 'custom-toast'
    });
  }

}
