import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home/projects', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [{ path: 'projects', component: ProjectsComponent }],
  },
  // Otras rutas aquí...
];
