import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth';
@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  async canActivate() {
    try { return (await this.auth.esAdministradorSeguro()) ? true : this.router.parseUrl('/login'); }
    catch { return this.router.parseUrl('/login'); }
  }
}
@Injectable({ providedIn: 'root' })
export class SesionGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}
  async canActivate() {
    try { return (await this.auth.esperarSesion()) ? true : this.router.parseUrl('/login'); }
    catch { return this.router.parseUrl('/login'); }
  }
}
