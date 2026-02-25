import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TemasService {

  private temaActual = new BehaviorSubject<string>('argentina'); 
  temaActual$ = this.temaActual.asObservable();

  // setTema(tema: string) {
  //   this.temaActual.next(tema);
  // }

  // getTema(): string {
  //   return this.temaActual.getValue();
  // }

  temaSonidos: string = '';
  temaIconos: string = '';

  setTema(tema: string) {
    this.temaActual.next(tema);
    this.temaSonidos = tema;
    this.temaIconos = tema;
  }

  getTema(): string {
    return this.temaActual.getValue();
  }

  setTemaSonidos(tema: string) {
    this.temaSonidos = tema;
    if(this.temaActual.getValue() === 'argentina' || this.temaActual.getValue() === 'profesional' || this.temaActual.getValue() === 'naif'){
      this.temaSonidos = '';
    }
  }
  
  getTemaSonidos(): string {
    return this.temaSonidos;
  }

  setTemaIconos(tema: string){
    this.temaIconos = tema;
    if(this.temaActual.getValue() === 'argentina' || this.temaActual.getValue() === 'profesional' || this.temaActual.getValue() === 'naif'){
      this.temaIconos = '';
    }
  }

  getTemaIconos(): string {
    return this.temaIconos;
  }
}


