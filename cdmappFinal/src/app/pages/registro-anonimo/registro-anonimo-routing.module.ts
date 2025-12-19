import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegistroAnonimoPage } from './registro-anonimo.page';

const routes: Routes = [
  {
    path: '',
    component: RegistroAnonimoPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistroAnonimoPageRoutingModule {}
