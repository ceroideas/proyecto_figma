import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  url = environment.url;
  constructor(private http: HttpClient) {}

  saveProject(project: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.url}/saveProject`, project, {
      headers: headers,
    });
  }

  updateAllProject(project: any, id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.url}/updateAllProject/${id}`, project, {
      headers: headers,
    });
  }
  getProjects() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.url}/getProjects`, { headers: headers });
  }

  getProject(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.url}/getProject/${id}`, { headers: headers });
  }
  saveNode(node: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.url}/saveNode`, node, { headers: headers });
  }
  getScenery(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.url}/getScenery/${id}`, { headers: headers });
  }
  getNode(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.get(`${this.url}/getNode/${id}`, { headers: headers });
  }

  updateScenery(id: any, body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.url}/updateScenery/${id}`, body, {
      headers: headers,
    });
  }
  saveScenery(body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.url}/saveScenery`, body, {
      headers: headers,
    });
  }

  saveSceneryNoPropagation(body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.url}/saveSceneryNoPropagation`, body, {
      headers: headers,
    });
  }
  updateNode(id: any, body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.url}/updateNode/${id}`, body, {
      headers: headers,
    });
  }

  deleteNode(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(`${this.url}/deleteNode/${id}`, {
      headers: headers,
    });
  }

  savePosition(id: any, position: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(
      `${this.url}/savePosition/${id}`,
      {
        position: position,
      },
      { headers: headers }
    );
  }
  saveZoom(id: any, zoom: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(
      `${this.url}/saveZoom/${id}`,
      { zoom: zoom },
      { headers: headers }
    );
  }

  updateProject(id: any, body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.url}/updateProject/${id}`, body, {
      headers: headers,
    });
  }

  deleteProject(id: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.delete(`${this.url}/deleteProject/${id}`, {
      headers: headers,
    });
  }

  saveUnite(id: any, body: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(`${this.url}/saveUnite/${id}`, body, {
      headers: headers,
    });
  }
  setHiddenTable(ids: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.put(
      `${this.url}/setHiddenTable`,
      { ids: ids },
      { headers: headers }
    );
  }

  getNodeData(formula: any) {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.url}/definitelyNotEval`, formula, {
      headers: headers,
    });
  }

  uploadProject(file: File, id: any) {
    const formData = new FormData();
    formData.append('file', file);
    console.log(file, 'FILE2');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    });
    return this.http.post(`${this.url}/uploadProject/${id}`, formData, {
      headers: headers,
    });
  }
}
