import { Injectable } from '@angular/core';

export interface ProductoCarrito {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  cantidad: number;
}

@Injectable({
  providedIn: 'root'
})
export class CarritoService {

  private carrito: ProductoCarrito[] = [];

  constructor() {
    this.cargarCarrito();
  }

  obtenerCarrito(): ProductoCarrito[] {
    return this.carrito;
  }

  agregarProducto(producto: any, cantidad: number) {

    const productoExistente = this.carrito.find(
      item => item.id === producto.id
    );

    if (productoExistente) {

    productoExistente.nombre = producto.nombre;
    productoExistente.precio = producto.precio;
    productoExistente.imagen = producto.imagen;
    productoExistente.categoria = producto.categoria;
    productoExistente.cantidad = cantidad;

  } else {

      this.carrito.push({
        id: producto.id,
        nombre: producto.nombre,
        precio: producto.precio,
        imagen: producto.imagen,
        categoria: producto.categoria,
        cantidad: cantidad
      });

    }

    this.guardarCarrito();
  }

  aumentarCantidad(id: number) {

    const producto = this.carrito.find(
      item => item.id === id
    );

    if (producto) {
      producto.cantidad++;
      this.guardarCarrito();
    }

  }

  disminuirCantidad(id: number) {

    const producto = this.carrito.find(
      item => item.id === id
    );

    if (!producto) {
      return;
    }

    if (producto.cantidad > 1) {

      producto.cantidad--;

    } else {

      this.eliminarProducto(id);

    }

    this.guardarCarrito();
  }

  eliminarProducto(id: number) {

    this.carrito = this.carrito.filter(
      item => item.id !== id
    );

    this.guardarCarrito();
  }

  vaciarCarrito() {

    this.carrito = [];
    this.guardarCarrito();

  }

  obtenerCantidadTotal(): number {

    return this.carrito.reduce(
      (total, producto) => total + producto.cantidad,
      0
    );

  }

  obtenerTotal(): number {

    return this.carrito.reduce(
      (total, producto) =>
        total + (producto.precio * producto.cantidad),
      0
    );

  }

  private guardarCarrito() {

    localStorage.setItem(
      'lushkaCarrito',
      JSON.stringify(this.carrito)
    );

  }

  private cargarCarrito() {

    const carritoGuardado =
      localStorage.getItem('lushkaCarrito');

    if (carritoGuardado) {

      this.carrito =
        JSON.parse(carritoGuardado);

    }

  }

}
