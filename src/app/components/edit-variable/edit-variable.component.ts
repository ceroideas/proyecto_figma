import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-edit-variable',
  standalone: true,
  imports: [],
  templateUrl: './edit-variable.component.html',
  styleUrl: './edit-variable.component.scss',
})
export class EditVariableComponent implements OnInit {
  ngOnInit(): void {
    new Chart('myChart', {
      type: 'bar',

      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
  }
}
