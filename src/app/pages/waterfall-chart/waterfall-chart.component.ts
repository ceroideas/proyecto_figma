import { Component } from '@angular/core';
import { InformationModalComponent } from 'src/app/components/information-modal/information-modal.component';

@Component({
  selector: 'app-waterfall-chart',
  standalone: true,
  imports: [InformationModalComponent],
  templateUrl: './waterfall-chart.component.html',
  styleUrl: './waterfall-chart.component.scss',
})
export class WaterfallChartComponent {}
