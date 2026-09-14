import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth';

@Component({
  selector: 'app-mi-cuenta',
  templateUrl: './mi-cuenta.page.html',
  styleUrls: ['./mi-cuenta.page.scss'],
  standalone: false,
})
export class MiCuentaPage {

  usuarioActual: Usuario | null = null;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ionViewWillEnter() {
    this.usuarioActual = this.authService.obtenerUsuarioActual();

    if (!this.usuarioActual) {
      this.router.navigate(['/login']);
    }
  }

  cerrarSesion() {
    this.authService.cerrarSesion();
    this.router.navigate(['/home']);
  }

  volverInicio() {
    this.router.navigate(['/home']);
  }

}
