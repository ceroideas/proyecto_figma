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

  savePosition(id: any, position: any) {
    return this.http.put(`${this.url}/savePosition/${id}`, {
      position: position,
    });
  }
  saveZoom(id: any, zoom: any) {
    return this.http.put(`${this.url}/saveZoom/${id}`, { zoom: zoom });
  }

  updateProject(id: any, body: any) {
    return this.http.put(`${this.url}/updateProject/${id}`, body);
  }

  deleteProject(id: any) {
    return this.http.delete(`${this.url}/deleteProject/${id}`);
  }

  saveUnite(id: any, body: any) {
    return this.http.put(`${this.url}/saveUnite/${id}`, body);
  }
  setHiddenTable(ids: any) {
    return this.http.put(`${this.url}/setHiddenTable`, { ids: ids });
  }

  getNodeData(formula: any) {
    return this.http.post(`${this.url}/definitelyNotEval`, formula);
  }

  uploadProject(file: File, id: any) {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file, 'FILE2');
    return this.http.post(`${this.url}/uploadProject/${id}`, formData);
  }
}
