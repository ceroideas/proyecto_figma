import { Component } from '@angular/core';
import { SetPriceComponent } from 'src/app/components/set-price/set-price.component';

@Component({
  selector: 'app-inspect',
  standalone: true,
  imports: [SetPriceComponent],
  templateUrl: './inspect.component.html',
  styleUrl: './inspect.component.scss',
})
export class InspectComponent {}
