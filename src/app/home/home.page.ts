import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth';
import {
  Producto,
  ProductosService
} from '../services/productos';
import { CarritoService } from '../services/carrito';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  private cancelarSuscripcionProductos: (() => void) | null = null;
  usuarioActual: Usuario | null = null;
  categorias = [
    { nombre: 'Capilar', icono: 'assets/icon/capilar.png' },
    { nombre: 'Facial', icono: 'assets/icon/facial.png' },
    { nombre: 'Corporal', icono: 'assets/icon/corporal.png' },
    { nombre: 'Combos', icono: 'assets/icon/combos.png' },
    { nombre: 'Crecimiento personal', icono: 'assets/icon/crecimiento-personal.png' }
  ];
  constructor(
    private router: Router,
    private authService: AuthService,
    private carritoService: CarritoService,
    private productosService: ProductosService
  ) { }

  async ionViewWillEnter() {
    this.cancelarSuscripcionProductos?.();
    this.actualizarProductosDestacados(this.productosService.obtenerProductos());
    this.cancelarSuscripcionProductos =
      this.productosService.suscribirProductos(
        productos => this.actualizarProductosDestacados(productos),
        error => console.error('Error sincronizando productos destacados', error)
      );

    this.usuarioActual = await this.authService.esperarSesion();
    try { await this.carritoService.cargarCarritoSiAutenticado(); }
    catch (error) { console.error('Error cargando carrito', error); }
  }

  ionViewWillLeave() {
    this.cancelarSuscripcionProductos?.();
    this.cancelarSuscripcionProductos = null;
  }

  private actualizarProductosDestacados(productos: Producto[]) {
    this.productosDestacados = productos.filter(producto => producto.destacado);
  }

  irAlCatalogo() {
    this.router.navigate(['/catalogo']);
  }

  irACategoria(categoria: string) {
    this.router.navigate(['/catalogo'], {
      queryParams: { categoria }
    });
  }

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  async cerrarSesion() {
    await this.authService.cerrarSesion();
    this.usuarioActual = null;
  }

  get primerNombre(): string {
    if (!this.usuarioActual) {
      return '';
    }

    return this.usuarioActual.nombre.split(' ')[0];
  }

  get cantidadCarrito(): number {
    return this.carritoService.obtenerCantidadProductos();
  }

  productosDestacados: Producto[] = [];

}