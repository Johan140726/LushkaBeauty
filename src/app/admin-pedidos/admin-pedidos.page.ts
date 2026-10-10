import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController } from '@ionic/angular';

import { AuthService, Usuario } from '../services/auth';
import { permiteRegularizar } from '../services/inventario';
import {
  Pedido,
  PedidosService,
  EstadoPedido
} from '../services/pedidos';


@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.page.html',
  styleUrls: ['./admin-pedidos.page.scss'],
  standalone: false,
})
export class AdminPedidosPage {

  usuarioActual: Usuario | null = null;

  pedidos: Pedido[] = [];
  guardandoPedidoId: number | null = null;

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
    private alertController: AlertController
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

    await this.cargarPedidos();
  }

  async cargarPedidos() {
    try { this.pedidos = await this.pedidosService.obtenerPedidos(); }
    catch (error) { await this.mostrarMensaje((error as Error).message); }
  }

  estadosDisponibles(pedido: Pedido): EstadoPedido[] {
    return this.pedidosService.estadosPermitidos(pedido);
  }

  requiereRegularizacion(pedido: Pedido): boolean {
    return permiteRegularizar(pedido.estado, pedido.inventarioDescontado === true, pedido.stockDevuelto === true);
  }

  async cambiarEstado(pedido: Pedido, nuevoEstado: EstadoPedido) {
    if (pedido.estado === nuevoEstado || this.guardandoPedidoId !== null) return;

    const advertencia = pedido.estado === 'Pendiente' && nuevoEstado === 'Confirmado'
      ? 'Se descontarán automáticamente las unidades del inventario. Si no hay stock suficiente, la operación se rechazará.'
      : nuevoEstado === 'Cancelado'
        ? (pedido.inventarioDescontado === true
            ? 'Se cancelará el pedido y se devolverán sus unidades al inventario.'
            : 'Se cancelará el pedido. No se devolverá stock porque no consta un descuento anterior.')
        : `Se cambiará el estado a ${nuevoEstado}.`;

    const confirmar = await this.confirmarAccion('Actualizar pedido', advertencia);
    if (!confirmar) { await this.cargarPedidos(); return; }
    this.guardandoPedidoId = pedido.id;
    try {
      await this.pedidosService.actualizarEstado(pedido.id, nuevoEstado);
      await this.cargarPedidos();
      await this.mostrarMensaje('Estado e inventario actualizados.', 'success');
    } catch (error) {
      await this.mostrarMensaje((error as Error).message);
      await this.cargarPedidos();
    } finally {
      this.guardandoPedidoId = null;
    }
  }

  async regularizarPedido(pedido: Pedido) {
    if (this.guardandoPedidoId !== null || !this.requiereRegularizacion(pedido)) return;
    const confirmar = await this.confirmarAccion(
      'Descontar inventario pendiente',
      `El pedido #${pedido.id} se confirmó antes de instalar esta función. ` +
      'Se restarán sus unidades del stock actual una sola vez. ¿Continuar?'
    );
    if (!confirmar) return;
    this.guardandoPedidoId = pedido.id;
    try {
      await this.pedidosService.regularizarInventario(pedido.id);
      await this.cargarPedidos();
      await this.mostrarMensaje('Inventario regularizado correctamente.', 'success');
    } catch (error) {
      await this.mostrarMensaje((error as Error).message);
      await this.cargarPedidos();
    } finally {
      this.guardandoPedidoId = null;
    }
  }

  private async confirmarAccion(titulo: string, mensaje: string): Promise<boolean> {
    const alerta = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: [
        { text: 'Volver', role: 'cancel' },
        { text: 'Continuar', role: 'confirm' }
      ]
    });
    await alerta.present();
    const { role } = await alerta.onDidDismiss();
    return role === 'confirm';
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