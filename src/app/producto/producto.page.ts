import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { CarritoService } from '../services/carrito';
import {
  ProductosService,
  Producto
} from '../services/productos';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.page.html',
  styleUrls: ['./producto.page.scss'],
  standalone: false
})
export class ProductoPage {

  productoSeleccionado: Producto | undefined;

  cantidad = 1;

  constructor(
    private route: ActivatedRoute,
    private carritoService: CarritoService,
    private toastController: ToastController,
    private productosService: ProductosService
  ) {}

  ionViewWillEnter() {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.productoSeleccionado =
      this.productosService.obtenerProductoPorId(id);

    this.cantidad = 1;
  }


  async aumentarCantidad() {

    if (!this.productoSeleccionado) {
      return;
    }

    if (
      this.cantidad >=
      this.productoSeleccionado.stock
    ) {

      await this.mostrarMensaje(
        `Solo hay ${this.productoSeleccionado.stock} unidades disponibles.`
      );

      return;
    }

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

    if (
      this.productoSeleccionado.stock <= 0
    ) {

      await this.mostrarMensaje(
        'Este producto está agotado.'
      );

      return;
    }

    if (
      this.cantidad >
      this.productoSeleccionado.stock
    ) {

      await this.mostrarMensaje(
        `Solo hay ${this.productoSeleccionado.stock} unidades disponibles.`
      );

      return;
    }

    this.carritoService.agregarProducto(
      this.productoSeleccionado,
      this.cantidad
    );

    await this.mostrarMensaje(
      `${this.productoSeleccionado.nombre} agregado al carrito`,
      'success'
    );
  }


  get agotado(): boolean {

    return (
      !this.productoSeleccionado ||
      this.productoSeleccionado.stock <= 0
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