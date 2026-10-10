// Sembrar SOLO si el catálogo todavía no contiene productos. Usa credenciales administrativas.
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { readFileSync } from 'node:fs';
initializeApp({ credential: applicationDefault() });
const db = getFirestore();
const productos = JSON.parse(readFileSync(new URL('./productos-iniciales.json', import.meta.url), 'utf8'));
const actual = await db.collection('productos').limit(1).get();
if (!actual.empty) { console.log('El catálogo ya tiene productos. No se duplicó nada.'); process.exit(0); }
const batch = db.batch();
for (const producto of productos) batch.set(db.doc(`productos/${producto.id}`), producto);
await batch.commit();
console.log(`${productos.length} productos iniciales creados en Firestore.`);
