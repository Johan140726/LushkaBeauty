import { NgModule } from '@angular/core';
import { AdminGuard, SesionGuard } from './guards/admin.guard';
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
    canActivate: [SesionGuard],
    loadChildren: () =>
      import('./mi-cuenta/mi-cuenta.module')
        .then(m => m.MiCuentaPageModule)
  },

  {
    path: 'checkout',
    canActivate: [SesionGuard],
    loadChildren: () =>
      import('./checkout/checkout.module')
        .then(m => m.CheckoutPageModule)
  },

  {
    path: 'mis-pedidos',
    canActivate: [SesionGuard],
    loadChildren: () =>
      import('./mis-pedidos/mis-pedidos.module')
        .then(m => m.MisPedidosPageModule)
  },

  {
    path: 'admin',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./admin/admin.module')
        .then(m => m.AdminPageModule)
  },

  {
    path: 'admin-pedidos',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./admin-pedidos/admin-pedidos.module')
        .then(m => m.AdminPedidosPageModule)
  },

  {
    path: 'admin-productos',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./admin-productos/admin-productos.module')
        .then(m => m.AdminProductosPageModule)
  },

  {
    path: 'admin-producto/nuevo',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./admin-producto-form/admin-producto-form.module')
        .then(m => m.AdminProductoFormPageModule)
  },

  {
    path: 'admin-producto/editar/:id',
    canActivate: [AdminGuard],
    loadChildren: () =>
      import('./admin-producto-form/admin-producto-form.module')
        .then(m => m.AdminProductoFormPageModule)
  },

  {
    path: 'admin-usuarios',
    canActivate: [AdminGuard],
    loadChildren: () => import('./admin-usuarios/admin-usuarios.module').then(m => m.AdminUsuariosPageModule)
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