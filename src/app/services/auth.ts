import { Injectable } from '@angular/core';

export interface Usuario {
  id: number;
  nombre: string;
  correo: string;
  telefono: string;
  password: string;
  rol: 'cliente' | 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private claveUsuarios = 'lushkaUsuarios';
  private claveSesion = 'lushkaUsuarioActual';

  constructor() {
    this.crearAdministradorInicial();
  }

  obtenerUsuarios(): Usuario[] {
    const usuariosGuardados = localStorage.getItem(this.claveUsuarios);

    if (!usuariosGuardados) {
      return [];
    }

    return JSON.parse(usuariosGuardados);
  }

  registrarUsuario(
    nombre: string,
    correo: string,
    telefono: string,
    password: string
  ): { ok: boolean; mensaje: string } {

    const usuarios = this.obtenerUsuarios();

    const correoNormalizado = correo.trim().toLowerCase();

    const usuarioExistente = usuarios.find(
      usuario => usuario.correo.toLowerCase() === correoNormalizado
    );

    if (usuarioExistente) {
      return {
        ok: false,
        mensaje: 'Ya existe una cuenta registrada con este correo.'
      };
    }

    const nuevoUsuario: Usuario = {
      id: Date.now(),
      nombre: nombre.trim(),
      correo: correoNormalizado,
      telefono: telefono.trim(),
      password,
      rol: 'cliente'
    };

    usuarios.push(nuevoUsuario);

    localStorage.setItem(
      this.claveUsuarios,
      JSON.stringify(usuarios)
    );

    return {
      ok: true,
      mensaje: 'Cuenta creada correctamente.'
    };
  }

  iniciarSesion(
    correo: string,
    password: string
  ): { ok: boolean; mensaje: string; usuario?: Usuario } {

    const usuarios = this.obtenerUsuarios();

    const correoNormalizado = correo.trim().toLowerCase();

    const usuario = usuarios.find(
      usuario =>
        usuario.correo.toLowerCase() === correoNormalizado &&
        usuario.password === password
    );

    if (!usuario) {
      return {
        ok: false,
        mensaje: 'Correo o contraseña incorrectos.'
      };
    }

    localStorage.setItem(
      this.claveSesion,
      JSON.stringify(usuario)
    );

    return {
      ok: true,
      mensaje: 'Inicio de sesión exitoso.',
      usuario
    };
  }

  obtenerUsuarioActual(): Usuario | null {
    const usuarioGuardado = localStorage.getItem(this.claveSesion);

    if (!usuarioGuardado) {
      return null;
    }

    return JSON.parse(usuarioGuardado);
  }

  cerrarSesion() {
    localStorage.removeItem(this.claveSesion);
  }

  estaAutenticado(): boolean {
    return this.obtenerUsuarioActual() !== null;
  }

  private crearAdministradorInicial() {

    const usuarios = this.obtenerUsuarios();

    const correoAdmin = 'admin@lushka.com';

    const adminExistente = usuarios.find(
      usuario =>
        usuario.correo.toLowerCase() === correoAdmin
    );

    if (adminExistente) {
      return;
    }

    const administrador: Usuario = {
      id: Date.now(),
      nombre: 'Administrador Lushka',
      correo: correoAdmin,
      telefono: '0000000000',
      password: 'Admin123',
      rol: 'admin'
    };

    usuarios.push(administrador);

    localStorage.setItem(
      this.claveUsuarios,
      JSON.stringify(usuarios)
    );
  }

    esAdministrador(): boolean {

    const usuario = this.obtenerUsuarioActual();

    return usuario?.rol === 'admin';

  }

}