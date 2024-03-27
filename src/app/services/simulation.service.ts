import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class SimulationService {
  url = environment.url;
  constructor(private http: HttpClient) {}

  saveSimulation(simulation: any) {
    return this.http.post(`${this.url}/saveSimulation`, simulation);
  }
  getSimulation(id: any) {
    return this.http.get(`${this.url}/getSimulation/${id}`);
  }

  getSimulations(id: any) {
    return this.http.get(`${this.url}/getSimulations/${id}`);
  }
  updateSimulation(id: any, simulation: any) {
    return this.http.put(`${this.url}/updateSimulation/${id}`, simulation);
  }
  deleteSimulation(id: any) {
    return this.http.delete(`${this.url}/deleteSimulation/${id}`);
  }
}
