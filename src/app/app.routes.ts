import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';


export const routes: Routes = [
    // Otras rutas aquí...
    {
      path: 'home',
      component: HomeComponent,
      children: [
       
       
        // Puedes agregar más rutas hijas según sea necesario...
      ]
    },
    // Otras rutas aquí...
  ];
