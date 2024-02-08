import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  url = environment.url;
  constructor(private http: HttpClient) {}

  saveProject(project: any) {
    return this.http.post(`${this.url}/saveProject`, project);
  }
  getProjects() {
    return this.http.get(`${this.url}/getProjects`);
  }

  getProject(id: any) {
    return this.http.get(`${this.url}/getProject/${id}`);
  }
  saveNode(node: any) {
    return this.http.post(`${this.url}/saveNode`, node);
  }
  getScenery(id: any) {
    return this.http.get(`${this.url}/getScenery/${id}`);
  }
  getNode(id: any) {
    return this.http.get(`${this.url}/getNode/${id}`);
  }

  updateScenery(id: any, body: any) {
    return this.http.put(`${this.url}/updateScenery/${id}`, body);
  }
  saveScenery(body: any) {
    return this.http.post(`${this.url}/saveScenery`, body);
  }
  updateNode(id: any, body: any) {
    return this.http.put(`${this.url}/updateNode/${id}`, body);
  }

  deleteNode(id: any) {
    return this.http.delete(`${this.url}/deleteNode/${id}`);
  }
}
