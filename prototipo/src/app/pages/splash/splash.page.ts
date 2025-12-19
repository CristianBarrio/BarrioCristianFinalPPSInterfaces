import { CommonModule, NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CambiarTemasComponent } from 'src/app/shared/components/cambiar-temas/cambiar-temas.component';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  imports: [IonicModule, NgClass, CommonModule],
  standalone: true
})
export class SplashPage implements OnInit {

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
    this.router.navigateByUrl('auth', { replaceUrl: true });
  }
}
