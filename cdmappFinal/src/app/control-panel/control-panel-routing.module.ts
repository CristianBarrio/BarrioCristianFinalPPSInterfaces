import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HardcodePage } from './control-panel.page';

const routes: Routes = [
  {
    path: '',
    component: HardcodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HardcodePageRoutingModule {}
