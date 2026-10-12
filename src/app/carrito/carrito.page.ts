import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import {
  CarritoService,
  ProductoCarrito
} from '../services/carrito';

import {
  ProductosService
} from '../services/productos';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: false
})
export class CarritoPage {

  productos: ProductoCarrito[] = [];

  constructor(
    private carritoService: CarritoService,
    private productosService: ProductosService,
    private router: Router,
    private toastController: ToastController
  ) {}

  async ionViewWillEnter() {
    try {
      await this.productosService.cargarProductos();
      this.productos = await this.carritoService.cargarCarrito();
    } catch (error) {
      this.productos = [];
      await this.mostrarMensaje((error as Error).message);
      this.router.navigate(['/login']);
    }
  }

  async aumentar(id: number) {

    const productoCarrito =
      this.productos.find(
        producto => producto.id === id
      );

    if (!productoCarrito) {
      return;
    }

    const productoActual =
      this.productosService
        .obtenerProductoPorId(id);

    if (!productoActual) {

      await this.mostrarMensaje(
        'Este producto ya no está disponible.'
      );

      return;
    }

    if (
      productoCarrito.cantidad >=
      productoActual.stock
    ) {

      await this.mostrarMensaje(
        `Solo hay ${productoActual.stock} unidades disponibles de ${productoActual.nombre}.`
      );

      return;
    }

    await this.carritoService.aumentarCantidad(id);

    this.productos =
      this.carritoService.obtenerCarrito();
  }

  async disminuir(id: number) {

    await this.carritoService.disminuirCantidad(id);

    this.productos =
      this.carritoService.obtenerCarrito();
  }

  async eliminar(id: number) {

    await this.carritoService.eliminarProducto(id);

    this.productos =
      this.carritoService.obtenerCarrito();
  }

  obtenerStock(id: number): number {

    const producto =
      this.productosService
        .obtenerProductoPorId(id);

    return producto?.stock ?? 0;
  }

  stockInsuficiente(
    producto: ProductoCarrito
  ): boolean {

    return (
      producto.cantidad >
      this.obtenerStock(producto.id)
    );
  }

  irACheckout() {
    this.router.navigate(['/checkout']);
  }

  get subtotal(): number {
    return this.carritoService.obtenerTotal();
  }

  get cantidadCarrito(): number {
    return this.carritoService.obtenerCantidadProductos();
  }

  get hayProblemasDeStock(): boolean {

    return this.productos.some(
      producto =>
        this.stockInsuficiente(producto)
    );
  }

  private async mostrarMensaje(
    mensaje: string
  ) {

    const toast =
      await this.toastController.create({

        message: mensaje,
        duration: 2200,
        position: 'bottom',

        icon: 'alert-circle-outline',

        cssClass: [
          'lushka-toast',
          'toast-error'
        ]

      });

    await toast.present();
  }

}