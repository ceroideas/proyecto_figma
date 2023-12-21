import { CUSTOM_ELEMENTS_SCHEMA, Component } from '@angular/core';

import { RouterModule } from '@angular/router';
import { EditVariableComponent } from 'src/app/components/edit-variable/edit-variable.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, EditVariableComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
