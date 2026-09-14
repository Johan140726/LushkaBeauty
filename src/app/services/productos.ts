import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  private claveProductos = 'lushkaProductos';

  private productos: Producto[] = [];

  private productosIniciales: Producto[] = [

    {
      id: 1,
      nombre: 'Aceite Capilar',
      categoria: 'Capilar',
      precio: 13000,
      imagen: 'assets/productos/Capilar/AceiteCapilar.jpg',
      descripcion: 'Producto para el cuidado y nutrición del cabello.',
      stock: 0
    },

    {
      id: 2,
      nombre: 'Acondicionador',
      categoria: 'Capilar',
      precio: 15000,
      imagen: 'assets/productos/Capilar/Acondicionador.png',
      descripcion: 'Acondicionador para complementar tu rutina capilar.',
      stock: 0
    },

    {
      id: 3,
      nombre: 'Tratamiento de Aguacate',
      categoria: 'Capilar',
      precio: 15000,
      imagen: 'assets/productos/Capilar/Aguacate.jpg',
      descripcion: 'Tratamiento capilar con aguacate.',
      stock: 0
    },

    {
      id: 4,
      nombre: 'Crema para Peinar',
      categoria: 'Capilar',
      precio: 13000,
      imagen: 'assets/productos/Capilar/CremaPeinar.png',
      descripcion: 'Crema para peinar y cuidar tu cabello.',
      stock: 0
    },

    {
      id: 5,
      nombre: 'Shampoo',
      categoria: 'Capilar',
      precio: 20000,
      imagen: 'assets/productos/Capilar/shampoo.png',
      descripcion: 'Shampoo para complementar tu rutina de cuidado capilar.',
      stock: 0
    },

    {
      id: 6,
      nombre: 'Espuma Facial',
      categoria: 'Facial',
      precio: 15000,
      imagen: 'assets/productos/Facial/espuma.jpg',
      descripcion: 'Espuma para la limpieza y cuidado facial.',
      stock: 0
    },

    {
      id: 7,
      nombre: 'Tratamiento para Pestañas y Cejas',
      categoria: 'Facial',
      precio: 12000,
      imagen: 'assets/productos/Facial/pestañas.jpg',
      descripcion: 'Producto para el cuidado de pestañas y cejas.',
      stock: 0
    },

    {
      id: 8,
      nombre: 'Crema Corporal',
      categoria: 'Corporal',
      precio: 15000,
      imagen: 'assets/productos/Corporal/crema.png',
      descripcion: 'Crema para hidratar y cuidar la piel.',
      stock: 0
    },

    {
      id: 9,
      nombre: 'Aceite Corporal de Almendra',
      categoria: 'Corporal',
      precio: 18000,
      imagen: 'assets/productos/Corporal/almendra.jpg',
      descripcion: 'Aceite corporal con aroma de almendra.',
      stock: 0
    },

    {
      id: 10,
      nombre: 'Aceite Corporal de Chocolate',
      categoria: 'Corporal',
      precio: 18000,
      imagen: 'assets/productos/Corporal/chocolate.jpg',
      descripcion: 'Aceite corporal con aroma de chocolate.',
      stock: 0
    },

    {
      id: 11,
      nombre: 'Aceite Corporal de Coco',
      categoria: 'Corporal',
      precio: 18000,
      imagen: 'assets/productos/Corporal/coco.jpg',
      descripcion: 'Aceite corporal con aroma de coco.',
      stock: 0
    },

    {
      id: 12,
      nombre: 'Diario de Agradecimiento',
      categoria: 'Crecimiento personal',
      precio: 30000,
      imagen: 'assets/productos/CrecimientoPersonal/diario.jpg',
      descripcion: 'Diario de agradecimiento para acompañar momentos de reflexión y crecimiento personal.',
      stock: 0
    },

    {
      id: 13,
      nombre: 'Kit Bucal',
      categoria: 'Combos',
      precio: 25000,
      imagen: 'assets/productos/Combos/bucal.jpg',
      descripcion: 'Combo especial para el cuidado personal.',
      stock: 0
    },

    {
      id: 14,
      nombre: 'Caja Capilar',
      categoria: 'Combos',
      precio: 35000,
      imagen: 'assets/productos/Combos/CajaCapilar.jpg',
      descripcion: 'Combo especial para el cuidado del cabello.',
      stock: 0
    },

    {
      id: 15,
      nombre: 'Shine Box',
      categoria: 'Combos',
      precio: 30000,
      imagen: 'assets/productos/Combos/shineBox.jpg',
      descripcion: 'Combo especial de productos Lushka.',
      stock: 0
    }

  ];

  constructor() {
    this.cargarProductos();
  }


  obtenerProductos(): Producto[] {
    return this.productos;
  }


  obtenerProductoPorId(
    id: number
  ): Producto | undefined {

    return this.productos.find(
      producto => producto.id === id
    );
  }


  crearProducto(
    producto: Omit<Producto, 'id'>
  ): Producto {

    const nuevoProducto: Producto = {
      ...producto,
      id: Date.now()
    };

    this.productos.push(
      nuevoProducto
    );

    this.guardarProductos();

    return nuevoProducto;
  }


  actualizarProducto(
    productoActualizado: Producto
  ): boolean {

    const indice =
      this.productos.findIndex(
        producto =>
          producto.id === productoActualizado.id
      );

    if (indice === -1) {
      return false;
    }

    this.productos[indice] = {
      ...productoActualizado
    };

    this.guardarProductos();

    return true;
  }


  eliminarProducto(
    id: number
  ): boolean {

    const cantidadAnterior =
      this.productos.length;

    this.productos =
      this.productos.filter(
        producto => producto.id !== id
      );

    if (
      this.productos.length ===
      cantidadAnterior
    ) {
      return false;
    }

    this.guardarProductos();

    return true;
  }


  actualizarStock(
    id: number,
    nuevoStock: number
  ): boolean {

    const producto =
      this.obtenerProductoPorId(id);

    if (!producto) {
      return false;
    }

    producto.stock =
      Math.max(0, nuevoStock);

    this.guardarProductos();

    return true;
  }


  private guardarProductos() {

    localStorage.setItem(
      this.claveProductos,
      JSON.stringify(this.productos)
    );

  }


  private cargarProductos() {

    const productosGuardados =
      localStorage.getItem(
        this.claveProductos
      );

    if (productosGuardados) {

      this.productos =
        JSON.parse(productosGuardados);

      return;
    }

    this.productos =
      this.productosIniciales.map(
        producto => ({ ...producto })
      );

    this.guardarProductos();
  }

}