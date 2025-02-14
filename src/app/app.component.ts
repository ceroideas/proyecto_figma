import { Component } from '@angular/core';
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
} from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ComponentsModule } from './components/components.module';
import { TuiRoot } from '@taiga-ui/core';
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
    TuiRoot,
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy }],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Ztris';
}
