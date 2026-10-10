// EJECUTAR SOLO EN UNA COMPUTADORA ADMINISTRATIVA (nunca en el cliente web).
// GOOGLE_APPLICATION_CREDENTIALS=/ruta/clave-servicio.json node scripts/promover-admin.mjs correo@dominio.com
import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
const email = process.argv[2];
if (!email) { console.error('Uso: node scripts/promover-admin.mjs correo@dominio.com'); process.exit(1); }
initializeApp({ credential: applicationDefault() });
const usuario = await getAuth().getUserByEmail(email);
await getAuth().setCustomUserClaims(usuario.uid, { ...(usuario.customClaims || {}), admin: true });
await getFirestore().doc(`usuarios/${usuario.uid}`).set({ rol: 'admin',
  correo: usuario.email || email, nombre: usuario.displayName || 'Administrador' }, { merge: true });
console.log('Administrador configurado:', email, usuario.uid);
console.log('Cierra sesión y vuelve a iniciar para actualizar el token.');
