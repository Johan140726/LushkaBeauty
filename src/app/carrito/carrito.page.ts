import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CarritoService, ProductoCarrito } from '../services/carrito';

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
    private router: Router
  ) {}

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

  irACheckout() {
    this.router.navigate(['/checkout']);
  }

  get subtotal(): number {
    return this.carritoService.obtenerTotal();
  }

}