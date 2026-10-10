import { Injectable } from '@angular/core';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  getIdTokenResult,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

export interface Usuario {
  id: string;
  nombre: string;
  correo: string;
  telefono: string;
  rol: 'cliente' | 'admin';
}
export interface ResultadoAuth { ok: boolean; mensaje: string; usuario?: Usuario; }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private usuarioActual: Usuario | null = null;
  private readonly inicio: Promise<User | null>;

  // Previene que el observador de sesión y los métodos de registro/login
  // intenten crear dos veces el mismo documento /usuarios/{uid}.
  private registroEnCurso = false;
  private readonly perfilesPendientes = new Map<string, Promise<Usuario>>();

  constructor() {
    this.inicio = new Promise(resolve => {
      const cancel = onAuthStateChanged(auth, user => {
        cancel();
        resolve(user);
      }, () => resolve(null));
    });

    onAuthStateChanged(auth, user => {
      if (!user) {
        this.usuarioActual = null;
        return;
      }
      // createUserWithEmailAndPassword inicia sesión inmediatamente, antes
      // de que el formulario haya terminado de guardar el perfil.
      if (this.registroEnCurso) { return; }
      void this.leerPerfil(user)
        .then(perfil => {
          if (auth.currentUser?.uid === user.uid) {
            this.usuarioActual = perfil;
          }
        })
        .catch(error => {
          // La pantalla de login mostrará el error concreto si sucede.
          console.warn('No fue posible cargar el perfil de la sesión:', error);
        });
    });
  }

  private leerPerfil(user: User): Promise<Usuario> {
    const pendiente = this.perfilesPendientes.get(user.uid);
    if (pendiente) { return pendiente; }

    const trabajo = this.leerPerfilInterno(user);
    this.perfilesPendientes.set(user.uid, trabajo);
    const liberar = () => {
      if (this.perfilesPendientes.get(user.uid) === trabajo) {
        this.perfilesPendientes.delete(user.uid);
      }
    };
    trabajo.then(liberar, liberar);
    return trabajo;
  }

  private async leerPerfilInterno(user: User): Promise<Usuario> {
    const referencia = doc(db, 'usuarios', user.uid);
    const [snapshot, token] = await Promise.all([
      getDoc(referencia), getIdTokenResult(user)
    ]);

    // Un usuario creado en Authentication (sin Firestore) obtiene su perfil
    // cuando inicia sesión. El rol procede únicamente del token firmado.
    let datos = snapshot.data() || {};
    if (!snapshot.exists()) {
      const inicial = {
        nombre: user.displayName || user.email?.split('@')[0] || 'Usuario',
        correo: user.email || '',
        telefono: '',
        rol: token.claims['admin'] === true ? 'admin' : 'cliente',
        creadoEn: new Date().toISOString()
      };
      await setDoc(referencia, inicial);
      datos = inicial;
    }

    return {
      id: user.uid,
      nombre: String(datos['nombre'] || user.displayName || 'Usuario'),
      correo: user.email || '',
      telefono: String(datos['telefono'] || ''),
      rol: token.claims['admin'] === true ? 'admin' : 'cliente'
    };
  }

  async esperarSesion(): Promise<Usuario | null> {
    await this.inicio;
    const user = auth.currentUser;
    this.usuarioActual = user ? await this.leerPerfil(user) : null;
    return this.usuarioActual;
  }

  obtenerUsuarioActual(): Usuario | null { return this.usuarioActual; }
  estaAutenticado(): boolean { return auth.currentUser !== null; }
  esAdministrador(): boolean { return this.usuarioActual?.rol === 'admin'; }

  async esAdministradorSeguro(): Promise<boolean> {
    await this.inicio;
    if (!auth.currentUser) { return false; }
    return (await getIdTokenResult(auth.currentUser, true)).claims['admin'] === true;
  }

  async registrarUsuario(nombre: string, correo: string, telefono: string, password: string): Promise<ResultadoAuth> {
    // No permitir que el listener cree automáticamente el perfil mientras
    // el registro está en proceso. Evita la condición de carrera al registrar.
    this.registroEnCurso = true;
    try {
      const credential = await createUserWithEmailAndPassword(auth, correo.trim().toLowerCase(), password);
      const usuario: Usuario = {
        id: credential.user.uid,
        nombre: nombre.trim(),
        correo: credential.user.email || correo.trim().toLowerCase(),
        telefono: telefono.trim(),
        rol: 'cliente'
      };
      await updateProfile(credential.user, { displayName: usuario.nombre });
      await setDoc(doc(db, 'usuarios', usuario.id), {
        nombre: usuario.nombre,
        correo: usuario.correo,
        telefono: usuario.telefono,
        rol: 'cliente',
        creadoEn: new Date().toISOString()
      });
      this.usuarioActual = usuario;
      return { ok: true, mensaje: 'Cuenta creada correctamente.', usuario };
    } catch (error) {
      return { ok: false, mensaje: mensajeFirebase(error) };
    } finally {
      this.registroEnCurso = false;
    }
  }

  async iniciarSesion(correo: string, password: string): Promise<ResultadoAuth> {
    try {
      const credential = await signInWithEmailAndPassword(auth, correo.trim().toLowerCase(), password);
      // Comparte una sola lectura/escritura de perfil con el observador.
      const usuario = await this.leerPerfil(credential.user);
      this.usuarioActual = usuario;
      return { ok: true, mensaje: 'Inicio de sesión exitoso.', usuario };
    } catch (error) {
      return { ok: false, mensaje: mensajeFirebase(error) };
    }
  }

  async cerrarSesion(): Promise<void> {
    await signOut(auth);
    this.usuarioActual = null;
  }

  async obtenerUsuarios(): Promise<Usuario[]> {
    if (!(await this.esAdministradorSeguro())) { throw new Error('Acceso restringido a administradores.'); }
    const snapshot = await getDocs(collection(db, 'usuarios'));
    return snapshot.docs.map(item => ({
      id: item.id,
      nombre: String(item.data()['nombre'] || ''),
      correo: String(item.data()['correo'] || ''),
      telefono: String(item.data()['telefono'] || ''),
      rol: item.data()['rol'] === 'admin' ? 'admin' : 'cliente'
    }));
  }

  async actualizarMisDatos(nombre: string, telefono: string): Promise<void> {
    const usuario = await this.esperarSesion();
    if (!usuario) { throw new Error('Inicia sesión.'); }
    await updateDoc(doc(db, 'usuarios', usuario.id), {
      nombre: nombre.trim(), telefono: telefono.trim()
    });
    this.usuarioActual = { ...usuario, nombre: nombre.trim(), telefono: telefono.trim() };
  }
}

export function mensajeFirebase(error: unknown): string {
  const code = String((error as { code?: string })?.code || '');
  const mensajes: Record<string, string> = {
    'auth/email-already-in-use': 'Ya existe una cuenta registrada con ese correo.',
    'auth/invalid-email': 'El correo electrónico no es válido.',
    'auth/weak-password': 'La contraseña no cumple el mínimo de seguridad.',
    'auth/invalid-credential': 'Correo o contraseña incorrectos.',
    'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde.',
    'unavailable': 'No se pudo conectar. Revisa tu conexión a Internet.',
    'permission-denied': 'Firestore rechazó el acceso al perfil. Verifica las reglas de /usuarios/{uid}.'
  };
  return mensajes[code] || ((error as Error)?.message || 'No fue posible conectar con Firebase.');
}
