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
