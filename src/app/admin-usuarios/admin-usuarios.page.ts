import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, Usuario } from '../services/auth';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-admin-usuarios',
  templateUrl: './admin-usuarios.page.html',
  styleUrls: ['./admin-usuarios.page.scss'],
  standalone: false
})
export class AdminUsuariosPage {
  usuarios: Usuario[] = [];
  buscando = false;
  filtro = '';
  constructor(private auth: AuthService, private router: Router, private toast: ToastController) {}

  async ionViewWillEnter() {
    if (!(await this.auth.esAdministradorSeguro())) {
      this.router.navigate(['/login']); return;
    }
    this.buscando = true;
    try { this.usuarios = await this.auth.obtenerUsuarios(); }
    catch (error) {
      const toast = await this.toast.create({ message: (error as Error).message, duration: 2800 });
      await toast.present();
    } finally { this.buscando = false; }
  }
  get totalAdministradores(): number {
    return this.usuarios.filter(usuario => usuario.rol === 'admin').length;
  }
  trackByUsuario(_: number, usuario: Usuario): string { return usuario.id; }
  get filtrados() {
    const t = this.filtro.trim().toLocaleLowerCase();
    return this.usuarios.filter(u => `${u.nombre} ${u.correo} ${u.rol}`.toLocaleLowerCase().includes(t));
  }
}
