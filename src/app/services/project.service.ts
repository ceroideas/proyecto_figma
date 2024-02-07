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
}
