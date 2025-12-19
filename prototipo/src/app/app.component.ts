import { Component } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CambiarTemasComponent } from './shared/components/cambiar-temas/cambiar-temas.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [IonicModule, CambiarTemasComponent]
})
export class AppComponent {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router.navigateByUrl('splash');
  }
}