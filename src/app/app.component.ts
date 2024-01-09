import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { RouterModule } from '@angular/router';
import { HighchartsChartModule } from 'highcharts-angular';
import { BuildModule } from './pages/build/build.module';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    ComponentsModule,
    HighchartsChartModule,
    BuildModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'figma';
}
