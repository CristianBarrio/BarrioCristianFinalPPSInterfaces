import { Component, OnInit } from '@angular/core';
import { FirebaseService } from '../../servicios/firebase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent  implements OnInit {

  correo = 'cocinero@cocinero.com';
  password = '111111';

  usuarioActual:any;

  constructor(private firebase:FirebaseService, private router:Router) { }

  ngOnInit() {}

  loguear(){
    this.firebase.login(this.correo, this.password).then((response)=>{
      response.subscribe((data) =>{
        this.usuarioActual = data[0];
        console.info(this.usuarioActual);
        if(this.usuarioActual != undefined){
          localStorage.setItem('user', JSON.stringify(data));
        }
        else{
          alert('ERROR: Revise su usuario y/o contraseña e inténtelo nuevamente');
        }
      });
    });
  }

  logout(){
    localStorage.removeItem('user');
    this.router.navigate(['login']);
  }

}
