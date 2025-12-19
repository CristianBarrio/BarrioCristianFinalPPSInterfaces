import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemasService {

  private temaActual = new BehaviorSubject<string>('argentina'); 
  temaActual$ = this.temaActual.asObservable();

  setTema(tema: string) {
    this.temaActual.next(tema);
  }

  getTema(): string {
    return this.temaActual.getValue();
  }
}

// @Injectable({ providedIn: 'root' })
// export class TemasService {

//   private temaActual = new BehaviorSubject<string>('argentina');
//   temaActual$ = this.temaActual.asObservable();

//   setTema(tema: string) {
//     this.temaActual.next(tema);

//     document.body.classList.remove(
//       'tema-argentina',
//       'tema-festivo',
//       'tema-profesional',
//       'tema-naif'
//     );
//     document.body.classList.add(`tema-${tema}`);
    
//     localStorage.setItem('theme', tema);
//   }

//   initTema() {
//     const guardado = localStorage.getItem('theme') || 'argentina';
//     this.setTema(guardado);
//   }

//   getTema() {
//     return this.temaActual.getValue();
//   }
// }

