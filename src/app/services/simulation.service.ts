import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  url = environment.url;
  constructor(private http: HttpClient) {}

  saveSimulation(simulation: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.url}/saveSimulation`, simulation, {
      headers: headers,
    });
  }

  createSimulation(simulation: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.url}/generateSimulation`, simulation, {
      headers: headers,
    });
  }
  getSimulation(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.url}/getSimulation/${id}`, {
      headers: headers,
    });
  }

  getSimulations(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.url}/getSimulations/${id}`, {
      headers: headers,
    });
  }
  updateSimulation(id: any, simulation: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.url}/updateSimulation/${id}`, simulation, {
      headers: headers,
    });
  }
  deleteSimulation(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(`${this.url}/deleteSimulation/${id}`, {
      headers: headers,
    });
  }
}
