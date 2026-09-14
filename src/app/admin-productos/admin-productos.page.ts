import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {
  AlertController,
  ToastController
} from '@ionic/angular';

import { AuthService, Usuario } from '../services/auth';
import {
  Producto,
  ProductosService
} from '../services/productos';

@Component({
  selector: 'app-admin-productos',
  templateUrl: './admin-productos.page.html',
  styleUrls: ['./admin-productos.page.scss'],
  standalone: false,
})
export class AdminProductosPage {

  usuarioActual: Usuario | null = null;
  productos: Producto[] = [];

  constructor(
    private authService: AuthService,
    private productosService: ProductosService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  ionViewWillEnter() {

    this.usuarioActual =
      this.authService.obtenerUsuarioActual();

    if (
      !this.usuarioActual ||
      this.usuarioActual.rol !== 'admin'
    ) {
      this.router.navigate(['/login']);
      return;
    }

    this.cargarProductos();
  }

  cargarProductos() {
    this.productos =
      this.productosService.obtenerProductos();
  }

  volverPanel() {
    this.router.navigate(['/admin']);
  }

  async confirmarEliminar(
    producto: Producto
  ) {

    const alert =
      await this.alertController.create({

        header: 'Eliminar producto',

        message:
          `¿Deseas eliminar "${producto.nombre}" del catálogo?`,

        cssClass: 'lushka-alert',

        buttons: [

          {
            text: 'Cancelar',
            role: 'cancel'
          },

          {
            text: 'Eliminar',
            role: 'destructive',
            handler: () => {
              this.eliminarProducto(producto);
            }
          }

        ]

      });

    await alert.present();
  }

  async eliminarProducto(
    producto: Producto
  ) {

    const eliminado =
      this.productosService.eliminarProducto(
        producto.id
      );

    if (!eliminado) {

      await this.mostrarMensaje(
        'No fue posible eliminar el producto.'
      );

      return;
    }

    this.cargarProductos();

    await this.mostrarMensaje(
      'Producto eliminado correctamente.',
      'success'
    );
  }

  private async mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' = 'error'
  ) {

    const toast =
      await this.toastController.create({

        message: mensaje,
        duration: 2000,
        position: 'bottom',

        icon:
          tipo === 'success'
            ? 'checkmark-circle-outline'
            : 'alert-circle-outline',

        cssClass: [
          'lushka-toast',
          tipo === 'success'
            ? 'toast-success'
            : 'toast-error'
        ]

      });

    await toast.present();
  }

}