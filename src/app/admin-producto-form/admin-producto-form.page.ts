import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

import { AuthService, Usuario } from '../services/auth';
import { Producto, ProductosService } from '../services/productos';

@Component({
  selector: 'app-admin-producto-form',
  templateUrl: './admin-producto-form.page.html',
  styleUrls: ['./admin-producto-form.page.scss'],
  standalone: false,
})
export class AdminProductoFormPage {

  usuarioActual: Usuario | null = null;

  modoEdicion = false;
  productoId: number | null = null;

  nombre = '';
  categoria = '';
  precio: number | null = null;
  stock: number | null = null;
  imagen = '';
  descripcion = '';

  categorias: string[] = [
    'Capilar',
    'Facial',
    'Corporal',
    'Combos',
    'Crecimiento personal'
  ];

  constructor(
    private authService: AuthService,
    private productosService: ProductosService,
    private route: ActivatedRoute,
    private router: Router,
    private toastController: ToastController
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

    this.cargarModoFormulario();
  }

  cargarModoFormulario() {

    const id =
      this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.modoEdicion = false;
      this.limpiarFormulario();
      return;
    }

    this.modoEdicion = true;
    this.productoId = Number(id);

    const producto =
      this.productosService.obtenerProductoPorId(
        this.productoId
      );

    if (!producto) {
      this.router.navigate(['/admin-productos']);
      return;
    }

    this.nombre = producto.nombre;
    this.categoria = producto.categoria;
    this.precio = producto.precio;
    this.stock = producto.stock;
    this.imagen = producto.imagen;
    this.descripcion = producto.descripcion;
  }

  async guardarProducto() {

    if (!this.nombre.trim()) {
      await this.mostrarMensaje(
        'Ingresa el nombre del producto.'
      );
      return;
    }

    if (!this.categoria.trim()) {
      await this.mostrarMensaje(
        'Selecciona una categoría.'
      );
      return;
    }

    if (
      this.precio === null ||
      this.precio < 0
    ) {
      await this.mostrarMensaje(
        'Ingresa un precio válido.'
      );
      return;
    }

    if (
      this.stock === null ||
      this.stock < 0
    ) {
      await this.mostrarMensaje(
        'Ingresa un stock válido.'
      );
      return;
    }

    if (!this.imagen.trim()) {
      await this.mostrarMensaje(
        'Ingresa la ruta de la imagen.'
      );
      return;
    }

    if (!this.descripcion.trim()) {
      await this.mostrarMensaje(
        'Ingresa una descripción.'
      );
      return;
    }

    if (
      this.modoEdicion &&
      this.productoId !== null
    ) {

      const productoActualizado: Producto = {
        id: this.productoId,
        nombre: this.nombre.trim(),
        categoria: this.categoria,
        precio: Number(this.precio),
        stock: Number(this.stock),
        imagen: this.imagen.trim(),
        descripcion: this.descripcion.trim()
      };

      const actualizado =
        this.productosService.actualizarProducto(
          productoActualizado
        );

      if (!actualizado) {
        await this.mostrarMensaje(
          'No fue posible actualizar el producto.'
        );
        return;
      }

      await this.mostrarMensaje(
        'Producto actualizado correctamente.',
        'success'
      );

    } else {

      this.productosService.crearProducto({
        nombre: this.nombre.trim(),
        categoria: this.categoria,
        precio: Number(this.precio),
        stock: Number(this.stock),
        imagen: this.imagen.trim(),
        descripcion: this.descripcion.trim()
      });

      await this.mostrarMensaje(
        'Producto creado correctamente.',
        'success'
      );
    }

    this.router.navigate([
      '/admin-productos'
    ]);
  }

  cancelar() {
    this.router.navigate([
      '/admin-productos'
    ]);
  }

  private limpiarFormulario() {

    this.productoId = null;
    this.nombre = '';
    this.categoria = '';
    this.precio = null;
    this.stock = null;
    this.imagen = '';
    this.descripcion = '';

  }

  private async mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' = 'error'
  ) {

    const toast =
      await this.toastController.create({
        message: mensaje,
        duration: 2200,
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