import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdminProductosPage } from './admin-productos.page';

const routes: Routes = [
  {
    path: '',
    component: AdminProductosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminProductosPageRoutingModule {}
