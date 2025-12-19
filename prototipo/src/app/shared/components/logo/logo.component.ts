import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { TemasService } from 'src/app/services/temas.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true
})
export class LogoComponent  implements OnInit {

  temaActual = 'argentina';

  constructor(private temaSvc: TemasService) { }

  ngOnInit() {
    this.temaActual = `tema-${this.temaSvc.getTema().toLowerCase()}`;
    this.temaSvc.temaActual$.subscribe(tema => {
      this.temaActual = `tema-${tema.toLowerCase()}`;
    });
  }

}
