import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { InspectComponent } from './pages/inspect/inspect.component';
import { WaterfallChartComponent } from './pages/waterfall-chart/waterfall-chart.component';
import { SimulateComponent } from './pages/simulate/simulate.component';
import { BuildComponent } from './pages/build/build.component';
import { ScenarioCalculationComponent } from './pages/scenario-calculation/scenario-calculation.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { AuthGuard } from './authGuard';
import { RestorePasswordComponent } from './pages/restore-password/restore-password.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home/projects', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'restore-password', component: RestorePasswordComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'projects',
        component: ProjectsComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'inspect/:id',
        component: InspectComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'waterfall',
        component: WaterfallChartComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'simulate/:id',
        component: SimulateComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'build/:id',
        component: BuildComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'scenario_calculation/:id',
        component: ScenarioCalculationComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
  { path: '**', redirectTo: '/home/projects', pathMatch: 'full' },
  // Otras rutas aquí...
];
