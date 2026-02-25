import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonButton, IonContent, IonList, IonItem, IonLabel } from "@ionic/angular/standalone";
import { TemasService } from 'src/app/services/temas.service';
import { IonicModule } from "@ionic/angular";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tema-editable',
  templateUrl: './tema-editable.component.html',
  styleUrls: ['./tema-editable.component.scss'],
  imports: [IonLabel, IonItem, IonList, IonContent, CommonModule, IonicModule, FormsModule],
  standalone: true
})
export class TemaEditableComponent {

    theme = {
    primaryColor: '#ff0000',
    secondaryColor: '#00ff00',
    fontFamily: 'system-ui',
    fontSize: 16
  };

  constructor(private temaSvc: TemasService) {}

  update() {
    this.temaSvc.updateCustomTheme(this.theme);
  }

}
