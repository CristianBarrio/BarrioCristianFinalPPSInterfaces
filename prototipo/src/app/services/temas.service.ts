import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CustomTheme } from '../models/custom-theme.model.js';
//export type IconTheme = 'argentina' | 'profesional' | 'naif' | '';

@Injectable({
  providedIn: 'root'
})
export class TemasService {

  private temaActual = new BehaviorSubject<string>('argentina'); 
  temaActual$ = this.temaActual.asObservable();

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

  /////////////////////////

  private customTheme$ = new BehaviorSubject<CustomTheme>({
    primaryColor: '#ff0000',
    secondaryColor: '#00ff00',
    fontFamily: 'system-ui',
    fontSize: 16
  });

  theme$ = this.customTheme$.asObservable();

  updateCustomTheme(partial: Partial<CustomTheme>) {
    const current = this.customTheme$.value;
    const updated = { ...current, ...partial };
    this.customTheme$.next(updated);
    this.applyTheme(updated);
  }

  private applyTheme(theme: CustomTheme) {
    const root = document.documentElement;
    root.style.setProperty('--primary-color', theme.primaryColor);
    root.style.setProperty('--secondary-color', theme.secondaryColor);
    root.style.setProperty('--app-font', theme.fontFamily);
    root.style.setProperty('--app-font-size', theme.fontSize + 'px');
  }
}
