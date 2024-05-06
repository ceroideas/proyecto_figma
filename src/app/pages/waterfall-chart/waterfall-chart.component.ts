import { Component, Input, OnInit } from '@angular/core';
import { InformationModalComponent } from 'src/app/components/information-modal/information-modal.component';
import { Location } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DataService } from 'src/app/services/data-service.service';
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

  constructor(private location: Location, private dataSvc: DataService) {}
  goBack() {
    this.location.back();
  }

  ngOnInit(): void {
    this.data = this.dataSvc.dataNodes;
    this.dataTierCero = this.dataSvc.tierCeroData;
    this.tierCeroValue = this.dataSvc.tierCero;
    console.log(this.data);

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: ['Brand A', 'Brand B', 'Brand C', 'Brand D'],
        datasets: [
          {
            label: 'Waterfall Chart',
            data: [100, 150, -50, 100],
            backgroundColor: [
              'LightGray', // Inicio
              '#2cb02c', // Ingresos
              '#ff3a58', // Gastos
              '#2cb02c', // Ganancias
            ],
            borderColor: [
              'rgba(54, 162, 235, 1)', // Inicio
              'rgba(54, 162, 235, 1)', // Ingresos
              'rgba(255, 99, 132, 1)', // Gastos
              'rgba(54, 162, 235, 1)', // Ganancias
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
    });
  }

  renderchart() {
    const label = [];
    const values = [];
    const backgroundColor = [];
    console.log(this.dataTierCero);
    label.push(this.dataTierCero[0].year);
    values.push(+this.dataTierCero[0].value.toString().replace(/,/g, ''));
    backgroundColor.push('LightGray');

    for (let i = 0; i < this.selectedNodes.length; i++) {
      const nodo = this.selectedNodes[i];
      label.push(nodo.name);

      console.log(
        parseFloat(
          nodo.value.toString().replace(/,/g, '').toLocaleString('es-ES')
        )
      );
      values.push(+nodo.value.toString().replace(/,/g, ''));
      const color = +nodo.value < 0 ? '#ff3a58' : '#2cb02c';
      backgroundColor.push(color);
    }

    label.push(this.dataTierCero[1].year);
    values.push(this.dataTierCero[1].value.toString().replace(/,/g, ''));
    backgroundColor.push('LightGray');

    console.log(label);
    console.log(values);
    console.log(backgroundColor);
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
    console.log('Evento recibido en el componente padre:', eventData);
    this.selectedNodes = eventData;
    this.renderchart();
  }
}
