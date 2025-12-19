import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ABMMesasComponent } from "./componentes/abm-mesas/abm-mesas.component";
import { IonicModule } from "@ionic/angular";

import { HardcodePageRoutingModule } from "./control-panel-routing.module";

import { HardcodePage } from "./control-panel.page";
import { ABMAdminsComponent } from "./componentes/abm-admins/abm-admins.component";
import { ABMClientesComponent } from "./componentes/abm-clientes/abm-clientes.component";
import { ABMEmpleadosComponent } from "./componentes/abm-empleados/abm-empleados.component";
import { ABMProductosComponent } from "./componentes/abm-productos/abm-productos.component";
import { TablaAdminsComponent } from "./componentes/tabla-admins/tabla-admins.component";
import { TablaClientesComponent } from "./componentes/tabla-clientes/tabla-clientes.component";
import { TablaEmpleadosComponent } from "./componentes/tabla-empleados/tabla-empleados.component";
import { TablaMesasComponent } from "./componentes/tabla-mesas/tabla-mesas.component";
import { TablaProductosComponent } from "./componentes/tabla-productos/tabla-productos.component";
import { MailingComponent } from "./componentes/mailing/mailing.component";
import { PedidoComponent } from "./componentes/pedido/pedido.component";
import { LoginComponent } from "./componentes/login/login.component";
import { PushComponent } from "./componentes/push/push.component";


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    HardcodePageRoutingModule,
  ],
  declarations: [
    HardcodePage,
    ABMMesasComponent,
    ABMAdminsComponent,
    ABMClientesComponent,
    ABMEmpleadosComponent,
    ABMProductosComponent,
    TablaAdminsComponent,
    TablaClientesComponent,
    TablaEmpleadosComponent,
    TablaMesasComponent,
    TablaProductosComponent,
    MailingComponent,
    PedidoComponent,
    LoginComponent,
    PushComponent
  ],
  schemas: [
  CUSTOM_ELEMENTS_SCHEMA
],
})
export class ControlPanelModule {}
