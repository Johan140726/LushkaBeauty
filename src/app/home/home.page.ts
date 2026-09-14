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

  constructor(
    private router: Router,
    private authService: AuthService,
    private productosService: ProductosService
  ) {}

  ionViewWillEnter() {
    this.usuarioActual = this.authService.obtenerUsuarioActual();
    
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

  verProducto(id: number) {
    this.router.navigate(['/producto', id]);
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
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