import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminProductoFormPage } from './admin-producto-form.page';

const routes: Routes = [
  {
    path: '',
    component: AdminProductoFormPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProductoFormPageRoutingModule {}
