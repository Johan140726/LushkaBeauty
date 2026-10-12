import { Injectable } from '@angular/core';
import { collection, getDocs, doc, getDoc, setDoc, deleteDoc, updateDoc, query, limit, writeBatch, onSnapshot } from 'firebase/firestore';
import { db, auth } from './firebase';
import { cloudinaryWorkerUrl } from '../../environments/cloudinary-config';

export interface Producto {
  id: number;
  nombre: string;
  categoria: string;
  precio: number;
  imagen: string;
  descripcion: string;
  stock: number;
  destacado: boolean;
}

@Injectable({ providedIn: 'root' })
export class ProductosService {
  private productos: Producto[] = [];

  obtenerProductos(): Producto[] { return this.productos; }
  obtenerProductoPorId(id: number): Producto | undefined { return this.productos.find(p => p.id === id); }

  async cargarProductos(): Promise<Producto[]> {
    const snap = await getDocs(collection(db, 'productos'));
    this.productos = snap.docs.map(s => this.mapearProducto(s.id, s.data()))
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
    return this.productos;
  }

  suscribirProductos(
    alActualizar: (productos: Producto[]) => void,
    alError: (error: Error) => void
  ): () => void {
    return onSnapshot(collection(db, 'productos'), snapshot => {
      this.productos = snapshot.docs
        .map(s => this.mapearProducto(s.id, s.data()))
        .sort((a, b) => a.nombre.localeCompare(b.nombre));
      alActualizar([...this.productos]);
    }, alError);
  }

  private mapearProducto(id: string, datos: Record<string, unknown>): Producto {
    return {
      ...datos,
      id: Number(id),
      destacado: datos['destacado'] === true
    } as Producto;
  }

  async cargarProducto(id: number): Promise<Producto | undefined> {
    const snap = await getDoc(doc(db, 'productos', String(id)));
    if (!snap.exists()) { return undefined; }
    const producto = this.mapearProducto(String(id), snap.data());
    this.productos = [...this.productos.filter(p => p.id !== id), producto];
    return producto;
  }

  async crearProducto(producto: Omit<Producto, 'id'>): Promise<Producto> {
    const nuevo = { ...producto, id: Date.now() };
    await setDoc(doc(db, 'productos', String(nuevo.id)), nuevo);
    await this.cargarProductos();
    return nuevo;
  }
  async actualizarProducto(producto: Producto): Promise<boolean> {
    await setDoc(doc(db, 'productos', String(producto.id)), producto);
    await this.cargarProductos();
    return true;
  }
  async eliminarProducto(id: number): Promise<boolean> {
    await deleteDoc(doc(db, 'productos', String(id)));
    await this.cargarProductos();
    return true;
  }
  async actualizarStock(id: number, nuevoStock: number): Promise<boolean> {
    await updateDoc(doc(db, 'productos', String(id)), { stock: Math.max(0, nuevoStock) });
    await this.cargarProductos();
    return true;
  }

  async cargarCatalogoInicial(): Promise<number> {
    if (!auth.currentUser) throw new Error('Debes iniciar sesión como administrador.');
    // No sobrescribir catálogo existente ni cambios hechos por el administrador.
    const existente = await getDocs(query(collection(db, 'productos'), limit(1)));
    if (!existente.empty) throw new Error('Ya existen productos; no se sobrescribió el catálogo.');
    const respuesta = await fetch('assets/catalogo-inicial.json');
    if (!respuesta.ok) throw new Error('No se encuentra el catálogo de demostración.');
    const datos: unknown = await respuesta.json();
    if (!Array.isArray(datos) || !datos.length) {
      throw new Error('El catálogo inicial está vacío o tiene formato incorrecto.');
    }
    const productos: Producto[] = datos.map((producto: Producto) => ({
      ...producto,
      destacado: producto.destacado === true
    }));
    const lote = writeBatch(db);
    for (const producto of productos) {
      lote.set(doc(db, 'productos', String(producto.id)), producto);
    }
    await lote.commit();
    await this.cargarProductos();
    return productos.length;
  }

  async subirImagen(file: File): Promise<string> {
    const tipos = ['image/jpeg', 'image/png', 'image/webp'];
    if (!tipos.includes(file.type)) {
      throw new Error('Solo se permiten imágenes JPG, PNG y WEBP.');
    }
    if (file.size === 0 || file.size > 5 * 1024 * 1024) {
      throw new Error('La imagen no debe estar vacía ni superar 5 MB.');
    }

    const usuario = auth.currentUser;
    if (!usuario) throw new Error('Debes iniciar sesión para subir imágenes.');

    // Forzamos la actualización del token para incorporar admin:true.
    const token = await usuario.getIdToken(true);
    const formulario = new FormData();
    formulario.append('file', file, file.name);

    let respuesta: Response;
    try {
      respuesta = await fetch(`${cloudinaryWorkerUrl}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formulario
      });
    } catch {
      throw new Error('No se pudo conectar con el servicio de imágenes. Comprueba Internet y CORS.');
    }

    let resultado: { ok?: boolean; url?: string; error?: string };
    try {
      resultado = await respuesta.json();
    } catch {
      throw new Error('El servicio de imágenes respondió con un formato inesperado.');
    }

    if (!respuesta.ok || resultado.ok !== true || typeof resultado.url !== 'string') {
      throw new Error(resultado.error || `Error al subir la imagen (HTTP ${respuesta.status}).`);
    }
    // Guardamos exclusivamente la URL pública HTTPS suministrada por Cloudinary.
    const url = new URL(resultado.url);
    if (url.protocol !== 'https:' || url.hostname !== 'res.cloudinary.com') {
      throw new Error('Cloudinary devolvió una URL no válida.');
    }
    return resultado.url;
  }
}
