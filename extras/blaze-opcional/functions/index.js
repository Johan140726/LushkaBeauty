import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { onCall, HttpsError } from 'firebase-functions/v2/https';

initializeApp();
const db = getFirestore();
const estados = ['Pendiente', 'Confirmado', 'En preparación', 'En camino', 'Entregado', 'Cancelado'];
const txt = (v, max = 160) => typeof v === 'string' ? v.trim().slice(0, max) : '';

export const crearPedido = onCall({ region: 'us-central1', maxInstances: 10 }, async request => {
  if (!request.auth) throw new HttpsError('unauthenticated', 'Debes iniciar sesión.');
  const d = request.data || {};
  const items = d.productos;
  if (!Array.isArray(items) || items.length < 1 || items.length > 30) {
    throw new HttpsError('invalid-argument', 'El pedido debe incluir entre 1 y 30 productos.');
  }
  const nombres = ['nombreCliente','cedula','telefonoCliente','ciudad','direccion','barrio'];
  if (nombres.some(key => !txt(d[key]))) throw new HttpsError('invalid-argument', 'Faltan datos de entrega.');
  const productos = items.map(p => ({ id: Number(p.id), cantidad: Number(p.cantidad) }));
  if (productos.some(p => !Number.isSafeInteger(p.id) || p.id <= 0 || !Number.isInteger(p.cantidad) || p.cantidad < 1 || p.cantidad > 100) ||
      new Set(productos.map(p => p.id)).size !== productos.length) {
    throw new HttpsError('invalid-argument', 'El pedido contiene productos o cantidades inválidos.');
  }
  const ids = productos.map(p => db.doc(`productos/${p.id}`));
  const nombre = txt(d.nombreCliente, 120), cedula = txt(d.cedula, 30);
  const telefono = txt(d.telefonoCliente, 30), ciudad = txt(d.ciudad, 80);
  const direccion = txt(d.direccion, 180), barrio = txt(d.barrio, 80);
  const observaciones = txt(d.observaciones, 500);
  const normalCiudad = ciudad.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const envio = ['bogota','soacha'].includes(normalCiudad) ? 8500 : 0;
  const id = Date.now() * 100 + Math.floor(Math.random() * 100);
  const pedidoRef = db.doc(`pedidos/${id}`);
  try {
    return await db.runTransaction(async tx => {
      const snapshots = await Promise.all(ids.map(r => tx.get(r)));
      const detalle = snapshots.map((s, i) => {
        if (!s.exists) throw new HttpsError('failed-precondition', `El producto ${productos[i].id} ya no existe.`);
        const p = s.data();
        if (!Number.isFinite(p.precio) || !Number.isSafeInteger(p.stock) || p.stock < productos[i].cantidad) {
          throw new HttpsError('failed-precondition', `Stock insuficiente de ${p.nombre}.`);
        }
        return { id: productos[i].id, nombre: p.nombre, precio: p.precio,
          imagen: p.imagen, categoria: p.categoria, cantidad: productos[i].cantidad };
      });
      const subtotal = detalle.reduce((total, p) => total + p.precio * p.cantidad, 0);
      const pedido = { id, usuarioId: request.auth.uid, nombreCliente: nombre, cedula,
        correoCliente: request.auth.token.email || '', telefonoCliente: telefono,
        productos: detalle, ciudad, direccion, barrio, observaciones,
        subtotal, envio, total: subtotal + envio, fecha: new Date().toISOString(),
        estado: 'Pendiente', stockDevuelto: false };
      // Firestore protege contra compras simultáneas: lectura de inventario + decremento + orden atómicos.
      snapshots.forEach((s, i) => tx.update(ids[i], { stock: s.data().stock - detalle[i].cantidad }));
      tx.create(pedidoRef, pedido);
      return pedido;
    });
  } catch (error) {
    if (error instanceof HttpsError) throw error;
    throw new HttpsError('internal', 'No se pudo crear el pedido.');
  }
});

export const actualizarEstadoPedido = onCall({ region: 'us-central1', maxInstances: 10 }, async request => {
  if (!request.auth?.token.admin) throw new HttpsError('permission-denied', 'Solo administradores.');
  const id = Number(request.data?.id), estado = request.data?.estado;
  if (!Number.isSafeInteger(id) || !estados.includes(estado)) {
    throw new HttpsError('invalid-argument', 'Estado o pedido no válido.');
  }
  const pedidoRef = db.doc(`pedidos/${id}`);
  await db.runTransaction(async tx => {
    const snap = await tx.get(pedidoRef);
    if (!snap.exists) throw new HttpsError('not-found', 'Pedido no encontrado.');
    const pedido = snap.data();
    if (pedido.estado === 'Cancelado' && estado !== 'Cancelado') {
      throw new HttpsError('failed-precondition', 'Un pedido cancelado no puede reactivarse.');
    }
    if (estado === 'Cancelado' && !pedido.stockDevuelto) {
      const refs = pedido.productos.map(p => db.doc(`productos/${p.id}`));
      const prods = await Promise.all(refs.map(ref => tx.get(ref)));
      // Los productos borrados del catálogo no impiden cancelar el pedido.
      prods.forEach((p, i) => { if (p.exists) tx.update(refs[i], { stock: p.data().stock + pedido.productos[i].cantidad }); });
      tx.update(pedidoRef, { estado, stockDevuelto: true });
    } else {
      tx.update(pedidoRef, { estado });
    }
  });
  return { ok: true };
});
