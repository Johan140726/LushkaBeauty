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
  destacado = false;
  subiendoImagen = false;
  guardando = false;

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

    await this.cargarModoFormulario();
  }

  async cargarModoFormulario() {

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
      await this.productosService.cargarProducto(
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
    this.destacado = producto.destacado;
  }

  async guardarProducto() {
    if (this.guardando || this.subiendoImagen) return;

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

    this.guardando = true;
    try {
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
        descripcion: this.descripcion.trim(),
        destacado: this.destacado
      };

      const actualizado =
        await this.productosService.actualizarProducto(
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

      await this.productosService.crearProducto({
        nombre: this.nombre.trim(),
        categoria: this.categoria,
        precio: Number(this.precio),
        stock: Number(this.stock),
        imagen: this.imagen.trim(),
        descripcion: this.descripcion.trim(),
        destacado: this.destacado
      });

      await this.mostrarMensaje(
        'Producto creado correctamente.',
        'success'
      );
    }

    this.router.navigate(['/admin-productos']);
    } catch (error) {
      await this.mostrarMensaje((error as Error).message);
    } finally { this.guardando = false; }
  }

  async seleccionarImagen(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.subiendoImagen = true;
    try {
      this.imagen = await this.productosService.subirImagen(file);
      await this.mostrarMensaje('Imagen subida correctamente a Cloudinary.', 'success');
    } catch (error) { await this.mostrarMensaje((error as Error).message); }
    finally { this.subiendoImagen = false; }
  }

  cancelar() {
    this.router.navigate(['/admin-productos']);
  }

  private limpiarFormulario() {

    this.productoId = null;
    this.nombre = '';
    this.categoria = '';
    this.precio = null;
    this.stock = null;
    this.imagen = '';
    this.descripcion = '';
    this.destacado = false;

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