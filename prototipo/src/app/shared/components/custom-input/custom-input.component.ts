import { Component, OnInit, Input } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  imports: [IonicModule,
    FormsModule,
    ReactiveFormsModule,
    CommonModule
  ],
  standalone: true
})
export class CustomInputComponent  implements OnInit {

  @Input() control!:FormControl;
  @Input() type!:string;
  @Input() label!:string;
  @Input() autocomplete!:string;
  @Input() icon!:string;

  isPassword!:boolean;
  hide:boolean = true;

  constructor() { }

  ngOnInit() {
    if(this.type == "password"){
      this.isPassword = true;
    }
  }

  showOrHidePassword(){
    this.hide = !this.hide;

    if(this.hide){
      this.type = "password";
    }else{
      this.type = "text";
    }
  }
}
