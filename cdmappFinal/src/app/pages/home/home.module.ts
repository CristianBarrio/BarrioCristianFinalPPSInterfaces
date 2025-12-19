import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HomePageRoutingModule } from './home-routing.module';

import { HomePage } from './home.page';
import { AdminComponent } from './componentes/admin/admin.component';
import { ClienteComponent } from './componentes/cliente/cliente.component';
import { ModalComponent } from './componentes/modal/modal.component';
import { MaitreComponent } from './componentes/maitre/maitre.component';
import { PedidoComponent } from './componentes/pedido/pedido.component';
import { MozoComponent } from './componentes/mozo/mozo.component';
import { CocinaComponent } from './componentes/cocina/cocina.component';
import { BartenderComponent } from './componentes/bartender/bartender.component';
import { ChatComponent } from './componentes/chat/chat.component';
import { OpcionesClienteComponent } from './componentes/opciones-cliente/opciones-cliente.component';
import { PagarPedidoComponent } from './componentes/pagar-pedido/pagar-pedido.component';
import { EncuestasComponent } from './componentes/encuestas/encuestas.component';
import { CargarEncuestaComponent } from './componentes/cargar-encuesta/cargar-encuesta.component';
import { ChartModule } from 'angular-highcharts';

@NgModule({
  imports: [CommonModule, FormsModule, IonicModule, HomePageRoutingModule,ChartModule],
  declarations: [
    HomePage,
    AdminComponent,
    ClienteComponent,
    ModalComponent,
    MaitreComponent,
    PedidoComponent,
    MozoComponent,
    CocinaComponent,
    BartenderComponent,
    ChatComponent,
    OpcionesClienteComponent,
    PagarPedidoComponent,
    EncuestasComponent,
    CargarEncuestaComponent
  ]
})
export class HomePageModule {}
