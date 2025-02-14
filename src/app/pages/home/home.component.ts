import {
  CUSTOM_ELEMENTS_SCHEMA,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { TuiAvatar } from '@taiga-ui/kit';
import { Router, RouterModule } from '@angular/router';
import { EditVariableComponent } from 'src/app/components/edit-variable/edit-variable.component';
import { AuthService } from 'src/app/services/auth.service';
import { TuiAutoColorPipe, TuiInitialsPipe } from '@taiga-ui/core';
import { SimulationService } from 'src/app/services/simulation.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    EditVariableComponent,
    TuiAutoColorPipe,
    TuiAvatar,
    TuiInitialsPipe,
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  userData: any = {};

  constructor(
    private router: Router,
    private authSvc: AuthService,
    private simulationSvc: SimulationService
  ) {
    const userFromStorage = localStorage.getItem('user');
    if (userFromStorage) {
      const user = JSON.parse(userFromStorage);
      this.userData = user;

      console.log(this.userData, 'DATA');
    } else {
      console.log('No se encontró ningún usuario en localStorage.');
    }
  }
  ngOnInit() {
    console.log('HomeComponent inicializado');
    this.simulationSvc.requestCompleted$.subscribe((completed) => {
      console.log(completed);
      if (completed) {
        console.log('SI');
        alert('La petición ha terminado.');
        // localStorage.removeItem('simulationData');
      }
    });
  }

  ngOnDestroy() {
    console.log('SIUUU');
    localStorage.removeItem('simulationData');
  }
  redirect(route: string) {
    const id = localStorage.getItem('project');
    if (id) {
      this.router.navigate([`home/${route}/${id}`]);
    }
  }

  logout() {
    this.authSvc.logout();
    this.router.navigate([`login`]);
    localStorage.removeItem('project');
  }
}
