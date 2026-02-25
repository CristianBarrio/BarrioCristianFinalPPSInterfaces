import { Component, inject, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { PopoverController } from '@ionic/angular';
import { TemasService } from 'src/app/servicios/temas.service';
import { UtilsService } from 'src/app/servicios/utils.service';

@Component({
  selector: 'app-cambiar-temas',
  templateUrl: './cambiar-temas.component.html',
  styleUrls: ['./cambiar-temas.component.scss'],
})
export class CambiarTemasComponent {

  utilsSvc = inject(UtilsService);
  router = inject(Router);

  esSplash = false;

  temas = [
    { name: 'festivo', icon: 'assets/custom.png' },
    { name: 'argentina', icon: 'assets/argentina/argentina.png' },
    { name: 'profesional', icon: 'assets/profesional/briefcase (1).png' },
    { name: 'naif', icon: 'assets/naif/paint2.png' }
  ];
  temaActual: string = '';
  //temaActual: string = localStorage.getItem('theme') || 'argentina';
  actualIcon: string = 'assets/argentina/argentina.png';
  colorToast: string = 'primary';
  
  //temaSonidos: string = 'argentina';
  //temaIconos: string = 'argentina';
  temaIconos: 'argentina' | 'profesional' | 'naif' = 'argentina';
  temaSonidos: 'argentina' | 'profesional' | 'naif' = 'argentina';
  
  constructor(private temaSvc: TemasService,
    private popoverCtrl: PopoverController
  ) {
    const temaGuardado = localStorage.getItem('theme');
    const iconoGuardado = localStorage.getItem('themeIcon');

    if (temaGuardado) {
      this.temaSvc.setTema(temaGuardado);
    }

    if (iconoGuardado) {
      this.actualIcon = iconoGuardado;
    }

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

    //this.temaSvc.setTema(tema);

    //document.body.className = `tema-${tema}`;
    this.temaSvc.setTema(tema);

    this.actualIcon = this.temas.find(t => t.name === tema)?.icon || 'assets/images-outline.svg';

    localStorage.setItem('theme', tema);
    localStorage.setItem('themeIcon', this.actualIcon);

    // this.utilsSvc.presentToast({
    //   message: `Tema ${tema}`,
    //   duration: 2000,
    //   color: this.colorToast,
    //   position: 'bottom',
    //   icon: 'color-palette-outline',
      
    //   cssClass: 'custom-toast'
    // });
  }

  defaultTheme = {
    background: '#f7a240',
    textColor: '#000000',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '15px',
    btnColor: '#9537ec',
    buttonHeight: '44px',
    buttonWidth: '100%',
    logoColor: '#fc0303',
    toolbarColor: '#10a8d6',
    iconColor: '#ee32cf',

    btnPosition: 'center',
    btnShape: 'rect',

    icons: 'argentina',
    sounds: 'argentina'
  };

  theme = { ...this.defaultTheme };

  btnSizeTemp = 20;
  fontSizeTemp = 15;


  aplicarCambios() {
    this.cambiarTema('festivo');

    this.theme.fontSize = `${this.fontSizeTemp}px`;

    const root = document.documentElement.style;

    root.setProperty('--custom-bg', this.theme.background);
    root.setProperty('--custom-btnColor', this.theme.btnColor);
    root.setProperty('--custom-textColor', this.theme.textColor);
    root.setProperty('--custom-fontFamily', this.theme.fontFamily);
    root.setProperty('--custom-fontSize', this.theme.fontSize);
    root.setProperty('--custom-logoColor', this.theme.logoColor);
    root.setProperty('--custom-Toolbar', this.theme.toolbarColor);
    root.setProperty('--custom-iconColor', this.theme.iconColor);

    this.temaSvc.setTemaIconos(this.temaIconos);

    this.temaSvc.setTemaSonidos(this.temaSonidos);

    document.body.classList.remove(
      'btn-left', 'btn-center', 'btn-right',
      'btn-round', 'btn-square', 'btn-rect'
    );

    document.body.classList.add(
      `btn-${this.theme.btnPosition}`,
      `btn-${this.theme.btnShape}`
    );

    this.popoverCtrl.dismiss();
  }

  //tema:string
  cambiarSonidos(tema: 'argentina' | 'profesional' | 'naif') {
    this.temaSonidos = tema;
  }

  cambiarIconos(tema: 'argentina' | 'profesional' | 'naif') {
    this.temaIconos = tema;
  }
}
