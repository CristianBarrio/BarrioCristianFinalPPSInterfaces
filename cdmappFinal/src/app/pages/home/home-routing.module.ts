import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { CargarEncuestaComponent } from './componentes/cargar-encuesta/cargar-encuesta.component';
import { EncuestasComponent } from './componentes/encuestas/encuestas.component';
import { OpcionesClienteComponent } from './componentes/opciones-cliente/opciones-cliente.component';
import { ClienteComponent } from './componentes/cliente/cliente.component';

const routes: Routes = [
  {
    path: '',
    component: HomePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomePageRoutingModule {}
