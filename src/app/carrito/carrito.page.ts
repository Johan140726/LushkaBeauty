import { Component } from '@angular/core';
import { CarritoService, ProductoCarrito } from '../services/carrito';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.page.html',
  styleUrls: ['./carrito.page.scss'],
  standalone: false
})
export class CarritoPage {

  productos: ProductoCarrito[] = [];
  costoEnvio = 8500;

  constructor(private carritoService: CarritoService) {}

  ionViewWillEnter() {
    this.productos = this.carritoService.obtenerCarrito();
  }

  aumentar(id: number) {
    this.carritoService.aumentarCantidad(id);
    this.productos = this.carritoService.obtenerCarrito();
  }

  disminuir(id: number) {
    this.carritoService.disminuirCantidad(id);
    this.productos = this.carritoService.obtenerCarrito();
  }

  eliminar(id: number) {
    this.carritoService.eliminarProducto(id);
    this.productos = this.carritoService.obtenerCarrito();
  }

  get subtotal(): number {
  return this.carritoService.obtenerTotal();
}

get total(): number {
  if (this.productos.length === 0) {
    return 0;
  }

  return this.subtotal + this.costoEnvio;
}

}
