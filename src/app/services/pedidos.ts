import { Injectable } from '@angular/core';
import { collection, doc, getDoc, getDocs, query, where, setDoc, runTransaction, type Transaction } from 'firebase/firestore';
import { auth, db } from './firebase';
import { ProductoCarrito } from './carrito';
import { movimientoPorCambio, transicionesDisponibles, permiteRegularizar } from './inventario';

export type EstadoPedido = 'Pendiente' | 'Confirmado' | 'En preparación' | 'En camino' | 'Entregado' | 'Cancelado';
export interface Pedido {
  id: number;
  usuarioId: string;
  nombreCliente: string; cedula: string; correoCliente: string; telefonoCliente: string;
  productos: ProductoCarrito[];
  ciudad: string; direccion: string; barrio: string; observaciones: string;
  subtotal: number; envio: number; total: number;
  fecha: string; estado: EstadoPedido; stockDevuelto: boolean;
  /** Solo aparece tras descontar inventario con la nueva versión. */
  inventarioDescontado?: boolean;
}

/**
 * Versión gratuita del proyecto: los pedidos son SOLICITUDES, no pagos.
 * Los precios y el stock se revisan con las fichas actuales de Firestore y
 * las reglas del servidor validan cada renglón frente al catálogo.
 * Al confirmar, un administrador descuenta stock mediante una transacción.
 * No son pagos ni reservas anticipadas de inventario.
 */
@Injectable({ providedIn: 'root' })
export class PedidosService {
  async obtenerPedidos(): Promise<Pedido[]> {
    if (!auth.currentUser) throw new Error('Debes iniciar sesión.');
    const snap = await getDocs(collection(db, 'pedidos'));
    return snap.docs.map(s => ({ ...s.data(), id: Number(s.id) } as Pedido))
      .sort((a, b) => b.id - a.id);
  }

  async obtenerPedidosPorUsuario(usuarioId: string): Promise<Pedido[]> {
    if (!auth.currentUser || auth.currentUser.uid !== usuarioId) {
      throw new Error('No tienes autorización para consultar estos pedidos.');
    }
    const snap = await getDocs(query(collection(db, 'pedidos'), where('usuarioId', '==', usuarioId)));
    return snap.docs.map(s => ({ ...s.data(), id: Number(s.id) } as Pedido))
      .sort((a, b) => b.id - a.id);
  }

  async crearPedido(datos: Omit<Pedido, 'id' | 'fecha' | 'estado' | 'stockDevuelto'>): Promise<Pedido> {
    const usuario = auth.currentUser;
    if (!usuario) throw new Error('Inicia sesión para enviar tu solicitud.');
    if (!Array.isArray(datos.productos) || datos.productos.length < 1 || datos.productos.length > 10) {
      throw new Error('El pedido admite entre 1 y 10 productos diferentes.');
    }
    const items = datos.productos.map(item => ({ id: Number(item.id), cantidad: Number(item.cantidad) }));
    if (items.some(item => !Number.isSafeInteger(item.id) || item.id < 1 ||
      !Number.isSafeInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 100) ||
      new Set(items.map(item => item.id)).size !== items.length) {
      throw new Error('La selección de productos no es válida.');
    }
    const obligatorios = [datos.nombreCliente, datos.cedula, datos.telefonoCliente,
      datos.ciudad, datos.direccion, datos.barrio];
    if (obligatorios.some(valor => !String(valor || '').trim())) {
      throw new Error('Completa los datos de contacto y entrega.');
    }

    // Siempre usamos nombre/precio/imagen/stock de Firestore, nunca los importes del carrito.
    const snapshots = await Promise.all(items.map(item => getDoc(doc(db, 'productos', String(item.id)))));
    const productos: ProductoCarrito[] = snapshots.map((snapshot, index) => {
      const item = items[index];
      if (!snapshot.exists()) throw new Error(`El producto ${item.id} ya no está disponible.`);
      const ficha = snapshot.data();
      const precio = Number(ficha['precio']);
      const stock = Number(ficha['stock']);
      if (!Number.isInteger(precio) || precio < 0 || !Number.isInteger(stock) || stock < item.cantidad) {
        throw new Error(`Inventario insuficiente o precio inválido: ${ficha['nombre']}.`);
      }
      return {
        id: item.id, cantidad: item.cantidad, nombre: String(ficha['nombre']),
        precio, imagen: String(ficha['imagen']), categoria: String(ficha['categoria'])
      };
    });

    const ciudad = datos.ciudad.trim();
    const normal = ciudad.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    const envio = ['bogota', 'soacha'].includes(normal) ? 8500 : 0;
    const subtotal = productos.reduce((sum, item) => sum + item.precio * item.cantidad, 0);
    const id = Date.now() * 100 + Math.floor(Math.random() * 100);
    const pedido: Pedido = {
      id, usuarioId: usuario.uid,
      nombreCliente: datos.nombreCliente.trim().slice(0, 120),
      cedula: datos.cedula.trim().slice(0, 30),
      correoCliente: usuario.email || '',
      telefonoCliente: datos.telefonoCliente.trim().slice(0, 30),
      productos, ciudad: ciudad.slice(0, 80),
      direccion: datos.direccion.trim().slice(0, 180),
      barrio: datos.barrio.trim().slice(0, 80),
      observaciones: String(datos.observaciones || '').trim().slice(0, 500),
      subtotal, envio, total: subtotal + envio,
      fecha: new Date().toISOString(), estado: 'Pendiente', stockDevuelto: false
    };
    await setDoc(doc(db, 'pedidos', String(id)), pedido);
    return pedido;
  }

  /** Opciones permitidas sin retroceder estados ni revivir pedidos cancelados. */
  estadosPermitidos(pedido: Pedido): EstadoPedido[] {
    return transicionesDisponibles(pedido.estado);
  }

  /**
   * Confirmar: resta una sola vez. Cancelar después de confirmar: devuelve una sola vez.
   * Todos los documentos se leen antes de escribir. La transacción vuelve a ejecutarse
   * si otra operación cambia el stock o el pedido entre la lectura y el commit.
   */
  async actualizarEstado(id: number, nuevoEstado: EstadoPedido): Promise<boolean> {
    const usuario = auth.currentUser;
    if (!usuario) throw new Error('Debes iniciar sesión.');
    const token = await usuario.getIdTokenResult();
    if (token.claims['admin'] !== true) throw new Error('Solo el administrador puede actualizar pedidos.');
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Identificador de pedido inválido.');

    const referencia = doc(db, 'pedidos', String(id));
    await runTransaction(db, async (transaccion) => {
      const actual = await transaccion.get(referencia);
      if (!actual.exists()) throw new Error('El pedido ya no existe.');
      const pedido = actual.data() as Pedido;
      const movimiento = movimientoPorCambio(
        pedido.estado, nuevoEstado, pedido.inventarioDescontado === true
      );
      if (pedido.estado !== 'Pendiente' && pedido.estado !== 'Cancelado' &&
          pedido.estado !== 'Entregado' && pedido.inventarioDescontado !== true &&
          nuevoEstado !== 'Cancelado') {
        throw new Error('Este pedido se confirmó con la versión anterior. Aplica primero el descuento de inventario.');
      }

      if (movimiento === 'devolver' && pedido.stockDevuelto === true) {
        throw new Error('El stock de este pedido ya fue reintegrado.');
      }

      if (movimiento !== 'ninguno') {
        const ajustes = await this.calcularAjustes(transaccion, pedido, movimiento);
        for (const ajuste of ajustes) {
          transaccion.update(ajuste.referencia, { stock: ajuste.stock });
        }
      }

      const cambios: Record<string, unknown> = { estado: nuevoEstado };
      if (movimiento === 'descontar') {
        cambios['inventarioDescontado'] = true;
        cambios['stockDevuelto'] = false;
      } else if (movimiento === 'devolver') {
        cambios['inventarioDescontado'] = false;
        cambios['stockDevuelto'] = true;
      }
      transaccion.update(referencia, cambios);
    });
    return true;
  }

  /**
   * Pedido anterior confirmado antes de habilitar inventario automático:
   * solo por acción explícita del administrador (nunca al cambiar de pantalla).
   */
  async regularizarInventario(id: number): Promise<boolean> {
    const usuario = auth.currentUser;
    if (!usuario) throw new Error('Debes iniciar sesión.');
    const token = await usuario.getIdTokenResult();
    if (token.claims['admin'] !== true) throw new Error('Solo el administrador puede regularizar inventario.');
    if (!Number.isSafeInteger(id) || id <= 0) throw new Error('Identificador de pedido inválido.');

    const referencia = doc(db, 'pedidos', String(id));
    await runTransaction(db, async (transaccion) => {
      const actual = await transaccion.get(referencia);
      if (!actual.exists()) throw new Error('El pedido ya no existe.');
      const pedido = actual.data() as Pedido;
      if (!permiteRegularizar(pedido.estado, pedido.inventarioDescontado === true, pedido.stockDevuelto === true)) {
        throw new Error('Este pedido no necesita regularización o ya tiene el inventario descontado.');
      }
      const ajustes = await this.calcularAjustes(transaccion, pedido, 'descontar');
      for (const ajuste of ajustes) {
        transaccion.update(ajuste.referencia, { stock: ajuste.stock });
      }
      transaccion.update(referencia, { inventarioDescontado: true });
    });
    return true;
  }

  private async calcularAjustes(
    transaccion: Transaction,
    pedido: Pedido,
    movimiento: 'descontar' | 'devolver'
  ) {
    if (!Array.isArray(pedido.productos) || pedido.productos.length === 0 || pedido.productos.length > 10) {
      throw new Error('El pedido tiene una lista de productos inválida.');
    }
    const items = pedido.productos;
    const ids = new Set<number>();
    for (const item of items) {
      if (!Number.isSafeInteger(item.id) || item.id <= 0 ||
          !Number.isInteger(item.cantidad) || item.cantidad < 1 || item.cantidad > 100 || ids.has(item.id)) {
        throw new Error('El pedido contiene cantidades o productos inválidos.');
      }
      ids.add(item.id);
    }
    const referencias = items.map(item => doc(db, 'productos', String(item.id)));
    // Firestore exige TODAS las lecturas antes de la primera escritura de la transacción.
    const snapshots = await Promise.all(referencias.map(referencia => transaccion.get(referencia)));
    return snapshots.map((snapshot, indice) => {
      const item = items[indice];
      if (!snapshot.exists()) throw new Error(`El producto ${item.nombre} ya no existe. Revisa el pedido manualmente.`);
      const stock = snapshot.data()['stock'];
      if (!Number.isSafeInteger(stock) || stock < 0) {
        throw new Error(`Stock inválido para ${item.nombre}.`);
      }
      if (movimiento === 'descontar' && stock < item.cantidad) {
        throw new Error(`Stock insuficiente para ${item.nombre}: disponibles ${stock}, solicitadas ${item.cantidad}.`);
      }
      const siguiente = stock + (movimiento === 'descontar' ? -item.cantidad : item.cantidad);
      if (!Number.isSafeInteger(siguiente)) throw new Error('Se excedió el límite permitido de inventario.');
      return { referencia: referencias[indice], stock: siguiente };
    });
  }
}
