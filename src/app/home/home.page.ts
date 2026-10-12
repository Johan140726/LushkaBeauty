import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth';
import {
  Producto,
  ProductosService
} from '../services/productos';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

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
    private productosService: ProductosService
  ) { }

  async ionViewWillEnter() {
    this.usuarioActual = await this.authService.esperarSesion();
    try { await this.productosService.cargarProductos(); } catch (error) { console.error('Error cargando productos', error); }

    this.productosDestacados = [
      this.productosService.obtenerProductoPorId(1),
      this.productosService.obtenerProductoPorId(12),
      this.productosService.obtenerProductoPorId(8)
    ].filter(
      (producto): producto is Producto =>
        producto !== undefined
    );
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

  productosDestacados: Producto[] = [];

}