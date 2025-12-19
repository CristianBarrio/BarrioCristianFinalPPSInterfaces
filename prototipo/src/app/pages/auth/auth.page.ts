import { Component, OnInit, ViewEncapsulation, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { LogoComponent } from 'src/app/shared/components/logo/logo.component';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { TemasService } from 'src/app/services/temas.service';
import { CambiarTemasComponent } from 'src/app/shared/components/cambiar-temas/cambiar-temas.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
  imports: [CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    LogoComponent, 
    CustomInputComponent],
    standalone: true
})
export class AuthPage implements OnInit {

  temas = ['festivo', 'argentina', 'profesional', 'naif'];
  temaActual = 'tema-argentina';

  form = new FormGroup({
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required])
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);
  temaSvc = inject(TemasService);

  ngOnInit() {
    this.firebaseSvc.onSignOut.subscribe(() => {
      this.form.reset();
    });

    this.temaActual = `tema-${this.temaSvc.getTema().toLowerCase()}`;
    this.temaSvc.temaActual$.subscribe(tema => {
      this.temaActual = `tema-${tema.toLowerCase()}`;
    });
  }

  async submit(){
    if(this.form.valid){
      const loading = await this.utilsSvc.loading();
      await loading.present();

      this.firebaseSvc.signIn(this.form.value as User).then(res =>{
        const email = (this.form.value as User).email;
        const username = this.obtenerUsuario(email);
        localStorage.setItem('username', username);
        this.utilsSvc.routerLink('/main');

        if(this.temaActual === 'tema-festivo') this.utilsSvc.reproducirSonido('wolf.wav');
        if(this.temaActual === 'tema-naif') this.utilsSvc.reproducirSonido('page.wav');
        if(this.temaActual === 'tema-profesional') this.utilsSvc.reproducirSonido('quick-notification.wav');
        if(this.temaActual === 'tema-argentina') this.utilsSvc.reproducirSonido('tango2.mp3');

      }).catch(error => {
        console.log(error);
        this.utilsSvc.presentToast({
          message: "Credenciales inválidas.",
          duration: 3000,
          color: 'danger',
          position: 'bottom',
          icon: 'alert-circle-outline'
        });
      }).finally(() => {
        loading.dismiss();
      });
    }
  }

  usuariosRegistrados = [
    {correo: 'admin@admin.com', clave: '111111'},
    {correo: 'invitado@invitado.com', clave: '222222'},
    {correo: 'usuario@usuario.com', clave: '333333'},
    {correo: 'anonimo@anonimo.com', clave: '444444'},
    {correo: 'tester@tester.com', clave: '555555'},
    {correo: 'a@a.com', clave: '666666'}
  ];


  autocompletarUsuario(usuario: {correo:string, clave:string}){
    if(this.temaActual === 'tema-festivo') this.utilsSvc.reproducirSonido('christmasuser.wav');
    if(this.temaActual === 'tema-naif') this.utilsSvc.reproducirSonido('toy1.wav');
    if(this.temaActual === 'tema-profesional') this.utilsSvc.reproducirSonido('classic-click.wav');
    if(this.temaActual === 'tema-argentina') this.utilsSvc.reproducirSonido('mate1.mp3');

    this.form.patchValue({
      email: usuario.correo,
      password: usuario.clave
    });
  }

  obtenerUsuario(correo:string):string{
    const user = this.usuariosRegistrados.find(u => u.correo === correo);
    return user ? user.correo.split('@')[0] : 'unknown';
  }

}
