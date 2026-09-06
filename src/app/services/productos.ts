import { Injectable } from '@angular/core';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {

  productos: Producto[] = [
    {
      id: 1,
      nombre: 'Aceite Capilar',
      categoria: 'Capilar',
      precio: 13000,
      imagen: 'assets/productos/Capilar/AceiteCapilar.jpg',
      descripcion: 'Producto para el cuidado y nutrición del cabello.'
    },
    {
      id: 2,
      nombre: 'Acondicionador',
      categoria: 'Capilar',
      precio: 15000,
      imagen: 'assets/productos/Capilar/Acondicionador.png',
      descripcion: 'Acondicionador para complementar tu rutina capilar.'
    },
    {
      id: 3,
      nombre: 'Tratamiento de Aguacate',
      categoria: 'Capilar',
      precio: 15000,
      imagen: 'assets/productos/Capilar/Aguacate.jpg',
      descripcion: 'Tratamiento capilar con aguacate.'
    },
    {
      id: 4,
      nombre: 'Crema para Peinar',
      categoria: 'Capilar',
      precio: 0,
      imagen: 'assets/productos/Capilar/CremaPeinar.png',
      descripcion: 'Crema para peinar y cuidar tu cabello.'
    },
    {
      id: 5,
      nombre: 'Shampoo',
      categoria: 'Capilar',
      precio: 0,
      imagen: 'assets/productos/Capilar/shampoo.png',
      descripcion: 'Shampoo para complementar tu rutina de cuidado capilar.'
    },
    {
      id: 6,
      nombre: 'Espuma Facial',
      categoria: 'Facial',
      precio: 0,
      imagen: 'assets/productos/Facial/espuma.jpg',
      descripcion: 'Espuma para la limpieza y cuidado facial.'
    },
    {
      id: 7,
      nombre: 'Pestañas',
      categoria: 'Facial',
      precio: 0,
      imagen: 'assets/productos/Facial/pestañas.jpg',
      descripcion: 'Producto para complementar tu look de belleza.'
    },
    {
      id: 8,
      nombre: 'Crema Corporal',
      categoria: 'Corporal',
      precio: 0,
      imagen: 'assets/productos/Corporal/crema.png',
      descripcion: 'Crema para hidratar y cuidar la piel.'
    },
    {
      id: 9,
      nombre: 'Almendra',
      categoria: 'Corporal',
      precio: 0,
      imagen: 'assets/productos/Corporal/almendra.jpg',
      descripcion: 'Producto corporal con aroma de almendra.'
    },
    {
      id: 10,
      nombre: 'Chocolate',
      categoria: 'Corporal',
      precio: 0,
      imagen: 'assets/productos/Corporal/chocolate.jpg',
      descripcion: 'Producto corporal con aroma de chocolate.'
    },
    {
      id: 11,
      nombre: 'Coco',
      categoria: 'Corporal',
      precio: 0,
      imagen: 'assets/productos/Corporal/coco.jpg',
      descripcion: 'Producto corporal con aroma de coco.'
    },
    {
      id: 12,
      nombre: 'Diario de Agradecimiento',
      categoria: 'Crecimiento personal',
      precio: 30000,
      imagen: 'assets/productos/CrecimientoPersonal/diario.jpg',
      descripcion: 'Diario de agradecimiento para acompañar momentos de reflexión y crecimiento personal.'
    },
    {
      id: 13,
      nombre: 'Kit Bucal',
      categoria: 'Combos',
      precio: 0,
      imagen: 'assets/productos/Combos/bucal.jpg',
      descripcion: 'Combo especial para el cuidado personal.'
    },
    {
      id: 14,
      nombre: 'Caja Capilar',
      categoria: 'Combos',
      precio: 0,
      imagen: 'assets/productos/Combos/CajaCapilar.jpg',
      descripcion: 'Combo especial para el cuidado del cabello.'
    },
    {
      id: 15,
      nombre: 'Shine Box',
      categoria: 'Combos',
      precio: 0,
      imagen: 'assets/productos/Combos/shineBox.jpg',
      descripcion: 'Combo especial de productos Lushka.'
    }
  ];

  obtenerProductos(): Producto[] {
    return this.productos;
  }

  obtenerProductoPorId(id: number): Producto | undefined {
    return this.productos.find(producto => producto.id === id);
  }

}