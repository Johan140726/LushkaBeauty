import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
    private productosService: ProductosService
  ) {}

  async ionViewWillEnter() {
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

  verProducto(producto: Producto) {
    this.router.navigate(['/producto', producto.id]);
  }

}