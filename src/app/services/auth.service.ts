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
  sendCode(email: any) {
    return this.http.post(`${this.url}/sendCode`, email);
  }

  checkCode(code: any) {
    return this.http.post(`${this.url}/checkCode`, code);
  }

  changePassword(code: any) {
    return this.http.post(`${this.url}/changePassword`, code);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const isExpired = this.isTokenExpired();
      return !isExpired;
    }
    return false;
  }

  isTokenExpired() {
    const token = localStorage.getItem('token');

    if (!token) {
      // No hay token, considera que está caducado
      return true;
    }
    const expirationDate = this.helper.getTokenExpirationDate(token);
    const isExpired = this.helper.isTokenExpired(token);
    console.log('isExpired', expirationDate);
    return isExpired;
  }

  logout() {
    localStorage.removeItem('token');
  }

  resendVerification(email: string) {
    return this.http.post(`${this.url}/resend-verification`, { email });
  }
}
