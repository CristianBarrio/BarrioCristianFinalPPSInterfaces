import { CommonModule } from '@angular/common';
import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [IonicModule, CommonModule],
  standalone: true
})
export class HeaderComponent  implements OnInit {

  @Input() title!:string;
  @Input() backButton!:string;

  constructor() { }

  ngOnInit() {}

}
