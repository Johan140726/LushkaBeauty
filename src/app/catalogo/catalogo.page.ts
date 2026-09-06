import { Component } from '@angular/core';
import { Router } from '@angular/router';
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
    private router: Router,
    private productosService: ProductosService
  ) {
    this.productos = this.productosService.obtenerProductos();
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

  volverInicio() {
    this.router.navigate(['/home']);
  }

}