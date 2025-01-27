import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authSvc: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authSvc.isLoggedIn()) {
      if (this.authSvc.isTokenExpired()) {
        // Si el token ha expirado, limpiar el localStorage y redirigir al login
        this.authSvc.logout(); // Usar una función centralizada para limpiar datos
        this.router.navigate(['/login']);
        return false;
      }
      return true; // Token válido
    } else {
      localStorage.removeItem('project'); // Eliminar otros datos si es necesario
      this.router.navigate(['/login']);
      return false; // Usuario no está logueado
    }
  }
}
