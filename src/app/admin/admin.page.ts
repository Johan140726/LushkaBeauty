import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, Usuario } from '../services/auth';
import { Pedido, PedidosService } from '../services/pedidos';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.page.html',
  styleUrls: ['./admin.page.scss'],
  standalone: false,
})
export class AdminPage {

  usuarioActual: Usuario | null = null;

  pedidos: Pedido[] = [];

  totalPedidos = 0;
  pedidosPendientes = 0;
  pedidosEnProceso = 0;
  pedidosEntregados = 0;

  constructor(
    private authService: AuthService,
    private pedidosService: PedidosService,
    private router: Router
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

    this.cargarResumen();

  }

  cargarResumen() {

    this.pedidos =
      this.pedidosService.obtenerPedidos();

    this.totalPedidos =
      this.pedidos.length;

    this.pedidosPendientes =
      this.pedidos.filter(
        pedido => pedido.estado === 'Pendiente'
      ).length;

    this.pedidosEnProceso =
      this.pedidos.filter(
        pedido =>
          pedido.estado === 'Confirmado' ||
          pedido.estado === 'En preparación' ||
          pedido.estado === 'En camino'
      ).length;

    this.pedidosEntregados =
      this.pedidos.filter(
        pedido => pedido.estado === 'Entregado'
      ).length;

  }

  cerrarSesion() {

    this.authService.cerrarSesion();

    this.router.navigate(['/login']);

  }

}