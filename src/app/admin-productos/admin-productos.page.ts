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
  importandoCatalogo = false;

  constructor(
    private authService: AuthService,
    private productosService: ProductosService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController
  ) {}

  async ionViewWillEnter() {

    this.usuarioActual =
      await this.authService.esperarSesion();

    if (
      !this.usuarioActual ||
      this.usuarioActual.rol !== 'admin'
    ) {
      this.router.navigate(['/login']);
      return;
    }

    await this.cargarProductos();
  }

  async cargarProductos() {
    try { this.productos = await this.productosService.cargarProductos(); }
    catch (error) { await this.mostrarMensaje((error as Error).message); }
  }

  async importarCatalogoInicial() {
    if (this.importandoCatalogo || this.productos.length) return;
    this.importandoCatalogo = true;
    try {
      const cantidad = await this.productosService.cargarCatalogoInicial();
      await this.cargarProductos();
      await this.mostrarMensaje(`${cantidad} productos de ejemplo cargados. Edita el stock para comenzar a recibir pedidos.`, 'success');
    } catch (error) {
      await this.mostrarMensaje((error as Error).message);
    } finally {
      this.importandoCatalogo = false;
    }
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
      await this.productosService.eliminarProducto(
        producto.id
      );

    if (!eliminado) {

      await this.mostrarMensaje(
        'No fue posible eliminar el producto.'
      );

      return;
    }

    await this.cargarProductos();

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