import { Injectable } from '@angular/core';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface ProductoCarrito {
  id: number; nombre: string; precio: number; imagen: string; categoria: string; cantidad: number;
}
@Injectable({ providedIn: 'root' })
export class CarritoService {
  private carrito: ProductoCarrito[] = [];
  private uid: string | null = null;

  obtenerCarrito(): ProductoCarrito[] { return [...this.carrito]; }
  private validarUsuario(): string {
    const uid = auth.currentUser?.uid;
    if (!uid) { throw new Error('Inicia sesión para usar el carrito.'); }
    return uid;
  }
  async cargarCarrito(): Promise<ProductoCarrito[]> {
    const uid = this.validarUsuario();
    if (uid !== this.uid) { this.carrito = []; this.uid = uid; }
    const snap = await getDoc(doc(db, 'carritos', uid));
    this.carrito = (snap.data()?.['productos'] || []) as ProductoCarrito[];
    return this.obtenerCarrito();
  }
  async cargarCarritoSiAutenticado(): Promise<void> {
    if (!auth.currentUser) {
      this.carrito = [];
      this.uid = null;
      return;
    }
    await this.cargarCarrito();
  }
  private async guardar(): Promise<void> {
    const uid = this.validarUsuario();
    await setDoc(doc(db, 'carritos', uid), { productos: this.carrito, actualizadoEn: new Date().toISOString() });
  }
  async agregarProducto(producto: Omit<ProductoCarrito, 'cantidad'>, cantidad: number): Promise<void> {
    await this.cargarCarrito();
    const item = this.carrito.find(p => p.id === producto.id);
    if (item) { item.cantidad = cantidad; }
    else { this.carrito.push({ id: producto.id, nombre: producto.nombre, precio: producto.precio,
      imagen: producto.imagen, categoria: producto.categoria, cantidad }); }
    await this.guardar();
  }
  async aumentarCantidad(id: number): Promise<void> {
    const item = this.carrito.find(p => p.id === id);
    if (item) { item.cantidad++; await this.guardar(); }
  }
  async disminuirCantidad(id: number): Promise<void> {
    const item = this.carrito.find(p => p.id === id);
    if (item) {
      if (item.cantidad > 1) { item.cantidad--; } else { this.carrito = this.carrito.filter(p => p.id !== id); }
      await this.guardar();
    }
  }
  async eliminarProducto(id: number): Promise<void> {
    this.carrito = this.carrito.filter(p => p.id !== id); await this.guardar();
  }
  async vaciarCarrito(): Promise<void> {
    const uid = this.validarUsuario(); this.carrito = [];
    await deleteDoc(doc(db, 'carritos', uid));
  }
  obtenerCantidadProductos(): number { return this.carrito.length; }
  obtenerCantidadTotal(): number { return this.carrito.reduce((n, p) => n + p.cantidad, 0); }
  obtenerTotal(): number { return this.carrito.reduce((n, p) => n + p.precio * p.cantidad, 0); }
}
