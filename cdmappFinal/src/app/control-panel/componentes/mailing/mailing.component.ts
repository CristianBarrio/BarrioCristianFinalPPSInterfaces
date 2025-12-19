/* eslint-disable @angular-eslint/no-empty-lifecycle-method */
import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';

@Component({
  selector: 'app-mailing',
  templateUrl: './mailing.component.html',
  styleUrls: ['./mailing.component.scss'],
})
export class MailingComponent  implements OnInit {

  correo:string = '@gmail.com';
  usuario:string = '';
  decision:boolean = true;

  constructor(private firebase:FirebaseService) { }

  ngOnInit() {}


  enviarMail(){
    this.firebase.enviarMail(this.correo,this.usuario,this.decision);
  }

}
