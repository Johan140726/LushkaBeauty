import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService, Usuario } from '../services/auth';
import { Pedido, PedidosService } from '../services/pedidos';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.page.html',
  styleUrls: ['./mis-pedidos.page.scss'],
  standalone: false,
})
export class MisPedidosPage {

  usuarioActual: Usuario | null = null;
  pedidos: Pedido[] = [];

  constructor(
    private authService: AuthService,
    private pedidosService: PedidosService,
    private router: Router
  ) {}

  ionViewWillEnter() {

    this.usuarioActual =
      this.authService.obtenerUsuarioActual();

    if (!this.usuarioActual) {

      this.router.navigate(['/login']);
      return;

    }

    this.pedidos =
      this.pedidosService.obtenerPedidosPorUsuario(
        this.usuarioActual.id
      );

  }

  volverInicio() {
    this.router.navigate(['/home']);
  }

}