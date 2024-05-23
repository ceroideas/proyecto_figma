import { Component, Input, OnInit } from '@angular/core';
import { InformationModalComponent } from 'src/app/components/information-modal/information-modal.component';
import { Location } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DataService } from 'src/app/services/data-service.service';
import { Router } from '@angular/router';
Chart.register(...registerables);
@Component({
  selector: 'app-waterfall-chart',
  standalone: true,
  imports: [InformationModalComponent],
  templateUrl: './waterfall-chart.component.html',
  styleUrl: './waterfall-chart.component.scss',
})
export class WaterfallChartComponent implements OnInit {
  chart!: any;
  data: any[] = [];
  dataTierCero: any[] = [];
  tierCeroValue: any;
  selectedNodes: any[] = [];
  nodes: any[] = [];

  constructor(
    private location: Location,
    private dataSvc: DataService,
    private router: Router
  ) {}
  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.selectedNodes = this.dataSvc.getNodes();

    this.selectedNodes = this.selectedNodes.map((nodes: any) => {
      const node = {
        name: nodes.description,
        value: nodes.value,
        tier: nodes.tier,
      };
      return node;
    });

    this.data = this.dataSvc.dataNodes;
    this.dataTierCero = this.dataSvc.tierCeroData;
    this.tierCeroValue = this.dataSvc.tierCero;
    this.renderchart();
    /*     this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: ['Brand A', 'Brand B', 'Brand C', 'Brand D', 'Brand D'],
        datasets: [
          {
            label: 'Waterfall Chart',
            data: [50, 116, -96, -41, 29],
            backgroundColor: [
              'LightGray', // Inicio
              '#2cb02c', // Ingresos
              '#ff3a58', // Gastos
              '#2cb02c', // Ganancias
              '#2cb02c', // Ganancias
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)', // Inicio
              'rgba(54, 162, 235, 1)', // Ingresos
              'rgba(255, 99, 132, 1)', // Gastos
              'rgba(54, 162, 235, 1)', // Ganancias
              'rgba(54, 162, 235, 1)', // Ganancia
            ],
          },
        ],
      },
      options: {
        scales: {
          yAxes: {
            display: false,
          },
          y: {
            ticks: {
              display: false,
            },
          },
        },
      },
    }); */
  }

  renderchart() {
    const label = [];
    const values = [];
    const backgroundColor = [];

    label.push(this.dataTierCero[0].year);
    values.push(+this.dataTierCero[0].value.toString().replace(/,/g, ''));
    backgroundColor.push('LightGray');

    for (let i = 0; i < this.selectedNodes.length; i++) {
      const nodo = this.selectedNodes[i];
      label.push(nodo.name);

      nodo.value.toString().replace('.', '');

      values.push(nodo.value.toString().replace(/[,.]/g, ''));
      const color = +nodo.value < 0 ? '#ff3a58' : '#2cb02c';
      backgroundColor.push(color);
    }

    label.push(this.dataTierCero[1].year);

    values.push(this.dataTierCero[1].value.toString().replace(/,/g, ''));
    backgroundColor.push('LightGray');

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: label,
        datasets: [
          {
            label: 'Waterfall Chart',
            data: values,
            backgroundColor: backgroundColor,
            borderColor: backgroundColor,
          },
        ],
      },
      options: {
        scales: {
          yAxes: {
            display: true,
          },
          y: {
            ticks: {
              display: false,
            },
          },
        },
      },
    });
  }

  receiveNodes(eventData: any) {
    this.selectedNodes = eventData;

    this.renderchart();
  }
}
