import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
})
export class SplashPage  {

  temas = ['tema-argentina', 'tema-profesional', 'tema-naif', 'tema-festivo-navidad', 'tema-festivo-halloween', 'tema-festivo-pascua'];
  duraciones = [1500, 1500, 1500, 1500, 1500, 1500];
  temaActual = this.temas[0];

  constructor(public router: Router) {}

  ngOnInit() {
    let indice = 0;

    const cambiarTema = () => {
      if (indice < this.temas.length) {
        this.temaActual = this.temas[indice];

        setTimeout(() => {
          indice++;
          cambiarTema();
        }, this.duraciones[indice]);
      } else {
        this.irALogin();
      }
    };

    cambiarTema();
  }

  irALogin() {
    this.router.navigateByUrl('login', { replaceUrl: true });
  }
}
