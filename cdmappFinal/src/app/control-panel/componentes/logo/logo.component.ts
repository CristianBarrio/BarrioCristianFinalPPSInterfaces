import { Component, OnInit } from '@angular/core';
import { TemasService } from 'src/app/servicios/temas.service';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrls: ['./logo.component.scss']
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
