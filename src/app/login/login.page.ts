import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage {

  correo = '';
  password = '';
  mostrarPassword = false;

  constructor(
    private router: Router,
    private toastController: ToastController,
    private authService: AuthService
  ) {}

  cambiarVisibilidadPassword() {
    this.mostrarPassword = !this.mostrarPassword;
  }

  async iniciarSesion() {

    if (!this.correo.trim() || !this.password.trim()) {
      await this.mostrarMensaje(
        'Completa el correo y la contraseña.'
      );
      return;
    }

    const resultado = this.authService.iniciarSesion(
      this.correo,
      this.password
    );

    await this.mostrarMensaje(
      resultado.mensaje,
      resultado.ok ? 'success' : 'error'
    );

    if (resultado.ok && resultado.usuario) {

      if (resultado.usuario.rol === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/home']);
      }

    }
  }

  irARegistro() {
    this.router.navigate(['/registro']);
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
