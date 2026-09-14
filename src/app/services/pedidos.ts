import { Injectable } from '@angular/core';
import { ProductoCarrito } from './carrito';

export type EstadoPedido =
  | 'Pendiente'
  | 'Confirmado'
  | 'En preparación'
  | 'En camino'
  | 'Entregado'
  | 'Cancelado';

export interface Pedido {
  id: number;

  usuarioId: number;

  nombreCliente: string;
  cedula: string;
  correoCliente: string;
  telefonoCliente: string;

  productos: ProductoCarrito[];

  ciudad: string;
  direccion: string;
  barrio: string;
  observaciones: string;

  subtotal: number;
  envio: number;
  total: number;

  fecha: string;
  estado: EstadoPedido;
}

@Injectable({
  providedIn: 'root'
})
export class PedidosService {

  private clavePedidos = 'lushkaPedidos';

  constructor() { }

  obtenerPedidos(): Pedido[] {
    const pedidosGuardados = localStorage.getItem(this.clavePedidos);

    if (!pedidosGuardados) {
      return [];
    }

    return JSON.parse(pedidosGuardados);
  }

  crearPedido(pedido: Omit<Pedido, 'id' | 'fecha' | 'estado'>): Pedido {

    const pedidos = this.obtenerPedidos();

    const nuevoPedido: Pedido = {
      ...pedido,
      id: Date.now(),
      fecha: new Date().toISOString(),
      estado: 'Pendiente'
    };

    pedidos.push(nuevoPedido);

    localStorage.setItem(
      this.clavePedidos,
      JSON.stringify(pedidos)
    );

    return nuevoPedido;
  }

  obtenerPedidosPorUsuario(usuarioId: number): Pedido[] {
    return this.obtenerPedidos()
      .filter(pedido => pedido.usuarioId === usuarioId)
      .sort((a, b) => b.id - a.id);
  }

  obtenerPedidoPorId(id: number): Pedido | undefined {
    return this.obtenerPedidos()
      .find(pedido => pedido.id === id);
  }

  actualizarEstado(
    id: number,
    nuevoEstado: EstadoPedido
  ): boolean {

    const pedidos = this.obtenerPedidos();

    const pedido = pedidos.find(
      pedido => pedido.id === id
    );

    if (!pedido) {
      return false;
    }

    pedido.estado = nuevoEstado;

    localStorage.setItem(
      this.clavePedidos,
      JSON.stringify(pedidos)
    );

    return true;
  }

}