import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService, Usuario } from '../services/auth';
import {
  Pedido,
  PedidosService,
  EstadoPedido
} from '../services/pedidos';

import { ProductosService } from '../services/productos';

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.page.html',
  styleUrls: ['./admin-pedidos.page.scss'],
  standalone: false,
})
export class AdminPedidosPage {

  usuarioActual: Usuario | null = null;

  pedidos: Pedido[] = [];

  estados: EstadoPedido[] = [
    'Pendiente',
    'Confirmado',
    'En preparación',
    'En camino',
    'Entregado',
    'Cancelado'
  ];

  constructor(
    private authService: AuthService,
    private pedidosService: PedidosService,
    private router: Router,
    private toastController: ToastController,
    private productosService: ProductosService
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

    this.cargarPedidos();
  }

  cargarPedidos() {

    this.pedidos =
      this.pedidosService.obtenerPedidos()
        .sort((a, b) => b.id - a.id);

  }

  async cambiarEstado(
    pedido: Pedido,
    nuevoEstado: EstadoPedido
  ) {

    /*
    * Si el pedido se está cancelando
    * y todavía no hemos devuelto el stock,
    * devolvemos las unidades al inventario.
    */
    if (
      nuevoEstado === 'Cancelado' &&
      !pedido.stockDevuelto
    ) {

      for (const productoPedido of pedido.productos) {

        const productoActual =
          this.productosService
            .obtenerProductoPorId(
              productoPedido.id
            );

        if (!productoActual) {

          await this.mostrarMensaje(
            `No se encontró ${productoPedido.nombre} en el inventario.`
          );

          return;
        }

      }


      /*
      * Como comprobamos primero que todos
      * los productos existen, ahora sí
      * podemos devolver el stock.
      */
      for (const productoPedido of pedido.productos) {

        this.productosService.reponerStock(
          productoPedido.id,
          productoPedido.cantidad
        );

      }


      this.pedidosService.marcarStockDevuelto(
        pedido.id
      );

      pedido.stockDevuelto = true;

    }


    const actualizado =
      this.pedidosService.actualizarEstado(
        pedido.id,
        nuevoEstado
      );


    if (!actualizado) {

      await this.mostrarMensaje(
        'No fue posible actualizar el pedido.'
      );

      return;
    }


    pedido.estado = nuevoEstado;


    if (nuevoEstado === 'Cancelado') {

      await this.mostrarMensaje(
        'Pedido cancelado y stock devuelto al inventario.',
        'success'
      );

      return;
    }


    await this.mostrarMensaje(
      'Estado actualizado correctamente.',
      'success'
    );
  }

  volverPanel() {
    this.router.navigate(['/admin']);
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