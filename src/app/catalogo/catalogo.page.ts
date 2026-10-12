import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth';
import { CarritoService } from '../services/carrito';
import { ProductosService, Producto } from '../services/productos';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.page.html',
  styleUrls: ['./catalogo.page.scss'],
  standalone: false
})
export class CatalogoPage {

  categoriaSeleccionada = 'Todos';

  categorias = [
    'Todos',
    'Capilar',
    'Facial',
    'Corporal',
    'Combos',
    'Crecimiento personal'
  ];

  productos: Producto[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private carritoService: CarritoService,
    private productosService: ProductosService
  ) {}

  async ionViewWillEnter() {
    try {
      await this.authService.esperarSesion();
      await this.carritoService.cargarCarritoSiAutenticado();
    } catch (error) {
      console.error('Error cargando carrito', error);
    }

    const categoria = this.route.snapshot.queryParamMap.get('categoria');
    this.categoriaSeleccionada = categoria && this.categorias.includes(categoria)
      ? categoria
      : 'Todos';

    try { this.productos = await this.productosService.cargarProductos(); }
    catch (error) { console.error("Error cargando catálogo", error); }
  }

  seleccionarCategoria(categoria: string) {
    this.categoriaSeleccionada = categoria;
  }

  get productosFiltrados(): Producto[] {
    if (this.categoriaSeleccionada === 'Todos') {
      return this.productos;
    }

    return this.productos.filter(
      producto => producto.categoria === this.categoriaSeleccionada
    );
  }

  get cantidadCarrito(): number {
    return this.carritoService.obtenerCantidadProductos();
  }

  verProducto(producto: Producto) {
    this.router.navigate(['/producto', producto.id]);
  }

}