import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: 'home',
    loadChildren: () =>
      import('./home/home.module')
        .then(m => m.HomePageModule)
  },

  {
    path: 'catalogo',
    loadChildren: () =>
      import('./catalogo/catalogo.module')
        .then(m => m.CatalogoPageModule)
  },

  {
    path: 'producto/:id',
    loadChildren: () =>
      import('./producto/producto.module')
        .then(m => m.ProductoPageModule)
  },

  {
    path: 'carrito',
    loadChildren: () =>
      import('./carrito/carrito.module')
        .then(m => m.CarritoPageModule)
  },

  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module')
        .then(m => m.LoginPageModule)
  },

  {
    path: 'registro',
    loadChildren: () =>
      import('./registro/registro.module')
        .then(m => m.RegistroPageModule)
  },

  {
    path: 'mi-cuenta',
    loadChildren: () =>
      import('./mi-cuenta/mi-cuenta.module')
        .then(m => m.MiCuentaPageModule)
  },

  {
    path: 'checkout',
    loadChildren: () =>
      import('./checkout/checkout.module')
        .then(m => m.CheckoutPageModule)
  },

  {
    path: 'mis-pedidos',
    loadChildren: () =>
      import('./mis-pedidos/mis-pedidos.module')
        .then(m => m.MisPedidosPageModule)
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module')
        .then(m => m.AdminPageModule)
  },

  {
    path: 'admin-pedidos',
    loadChildren: () =>
      import('./admin-pedidos/admin-pedidos.module')
        .then(m => m.AdminPedidosPageModule)
  },

  {
    path: 'admin-productos',
    loadChildren: () =>
      import('./admin-productos/admin-productos.module')
        .then(m => m.AdminProductosPageModule)
  },

  {
    path: 'admin-producto/nuevo',
    loadChildren: () =>
      import('./admin-producto-form/admin-producto-form.module')
        .then(m => m.AdminProductoFormPageModule)
  },

  {
    path: 'admin-producto/editar/:id',
    loadChildren: () =>
      import('./admin-producto-form/admin-producto-form.module')
        .then(m => m.AdminProductoFormPageModule)
  },

  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  }

];

@NgModule({

  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],

  exports: [RouterModule]

})

export class AppRoutingModule {}