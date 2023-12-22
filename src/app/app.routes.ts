import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { InspectComponent } from './pages/inspect/inspect.component';
import { WaterfallChartComponent } from './pages/waterfall-chart/waterfall-chart.component';
import { SimulateComponent } from './pages/simulate/simulate.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home/projects', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      { path: 'projects', component: ProjectsComponent },
      {
        path: 'inspect',
        component: InspectComponent,
      },
      { path: 'waterfall', component: WaterfallChartComponent },
      { path: 'simulate', component: SimulateComponent },
    ],
  },
  // Otras rutas aquí...
];
