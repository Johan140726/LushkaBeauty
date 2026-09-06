import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CarritoService } from '../services/carrito';
import { ToastController } from '@ionic/angular';
import { ProductosService, Producto } from '../services/productos';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  standalone: false
})
export class ProductoPage implements OnInit {

  productoSeleccionado: Producto | undefined;
  cantidad = 1;

    constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private toastController: ToastController,
    private productosService: ProductosService
  ) {}

    ngOnInit() {

    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.productoSeleccionado =
      this.productosService.obtenerProductoPorId(id);

  }

    aumentarCantidad() {
    this.cantidad++;
  }

  disminuirCantidad() {
    if (this.cantidad > 1) {
      this.cantidad--;
    }
  }

  async agregarAlCarrito() {

  if (!this.productoSeleccionado) {
    return;
  }

  this.carritoService.agregarProducto(
    this.productoSeleccionado,
    this.cantidad
  );

  const toast = await this.toastController.create({
    message: `${this.productoSeleccionado.nombre} agregado al carrito`,
    duration: 1800,
    position: 'bottom',
    color: 'light'
  });

  await toast.present();
}

}