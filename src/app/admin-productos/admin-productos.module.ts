import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AdminProductosPageRoutingModule } from './admin-productos-routing.module';

import { AdminProductosPage } from './admin-productos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdminProductosPageRoutingModule
  ],
  declarations: [AdminProductosPage]
})
export class AdminProductosPageModule {}
