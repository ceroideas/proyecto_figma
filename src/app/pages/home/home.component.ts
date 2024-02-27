import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

import { Router, RouterModule } from '@angular/router';
import { EditVariableComponent } from 'src/app/components/edit-variable/edit-variable.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, EditVariableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  constructor(private router: Router) {}
  redirect(route: string) {
    const id = localStorage.getItem('project');
    if (id) {
      this.router.navigate([`home/${route}/${id}`]);
    }
  }
}
