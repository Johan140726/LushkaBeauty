import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: false,
})
export class RegistroPage {

  nombre = '';
  correo = '';
  telefono = '';
  password = '';
  confirmarPassword = '';

  mostrarPassword = false;
  mostrarConfirmarPassword = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  cambiarVisibilidadPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  cambiarVisibilidadConfirmarPassword() {
    this.mostrarConfirmarPassword = !this.mostrarConfirmarPassword;
  }

  async crearCuenta() {

    if (
      !this.nombre.trim() ||
      !this.correo.trim() ||
      !this.telefono.trim() ||
      !this.password.trim() ||
      !this.confirmarPassword.trim()
    ) {
      await this.mostrarMensaje('Completa todos los campos.');
      return;
    }

    if (this.password !== this.confirmarPassword) {
      await this.mostrarMensaje('Las contraseñas no coinciden.');
      return;
    }

    if (this.password.length < 6) {
      await this.mostrarMensaje(
        'La contraseña debe tener mínimo 6 caracteres.'
      );
      return;
    }

    const resultado = this.authService.registrarUsuario(
      this.nombre,
      this.correo,
      this.telefono,
      this.password
    );

    await this.mostrarMensaje(
      resultado.mensaje,
      resultado.ok ? 'success' : 'error'
    );

    if (resultado.ok) {
      this.router.navigate(['/login']);
    }
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  private async mostrarMensaje(
    mensaje: string,
    tipo: 'success' | 'error' = 'error'
  ) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2200,
      position: 'bottom',
      icon:
        tipo === 'success'
          ? 'checkmark-circle-outline'
          : 'alert-circle-outline',
      cssClass: [
        'lushka-toast',
        tipo === 'success' ? 'toast-success' : 'toast-error'
      ],
      buttons: [
        {
          icon: 'close-outline',
          role: 'cancel'
        }
      ]
    });

    await toast.present();
  }

}