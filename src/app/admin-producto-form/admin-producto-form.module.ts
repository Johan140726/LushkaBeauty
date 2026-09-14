import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminProductoFormPageRoutingModule } from './admin-producto-form-routing.module';

import { AdminProductoFormPage } from './admin-producto-form.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminProductoFormPageRoutingModule
  ],
  declarations: [AdminProductoFormPage]
})
export class AdminProductoFormPageModule {}
