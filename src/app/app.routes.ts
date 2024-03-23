import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { InspectComponent } from './pages/inspect/inspect.component';
import { WaterfallChartComponent } from './pages/waterfall-chart/waterfall-chart.component';
import { SimulateComponent } from './pages/simulate/simulate.component';
import { BuildComponent } from './pages/build/build.component';

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
      { path: 'simulate/:id', component: SimulateComponent },
      { path: 'build/:id', component: BuildComponent },
    ],
  },
  // Otras rutas aquí...
];
