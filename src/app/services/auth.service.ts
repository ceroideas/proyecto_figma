import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  url = environment.url;
  helper = new JwtHelperService();
  constructor(private http: HttpClient) {}

  register(user: any) {
    return this.http.post(`${this.url}/register`, user);
  }

  login(user: any) {
    return this.http.post(`${this.url}/login`, user);
  }

  isTokenExpired() {
    const token = localStorage.getItem('token'); // Reemplaza con la lógica para obtener el token

    if (!token) {
      // No hay token, considera que está caducado
      return true;
    }

    const expirationDate = this.helper.getTokenExpirationDate(token);
    const isExpired = this.helper.isTokenExpired(token);

    return isExpired;
  }
}
