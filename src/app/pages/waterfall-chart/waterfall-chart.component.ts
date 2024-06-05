import { Component, Input, OnInit } from '@angular/core';
import { InformationModalComponent } from 'src/app/components/information-modal/information-modal.component';
import { Location } from '@angular/common';
import { Chart, registerables } from 'chart.js';
import { DataService } from 'src/app/services/data-service.service';
import { Router } from '@angular/router';
Chart.register(...registerables);
declare var Plotly: any;
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

    label.push(this.dataTierCero[0].year);
    values.push(+this.dataTierCero[0].value.toString().replace(/,/g, ''));
    console.log(this.dataTierCero, 'NODES');

    for (let i = 0; i < this.selectedNodes.length; i++) {
      const nodo = this.selectedNodes[i];
      label.push(nodo.name);

      nodo.value.toString().replace('.', '');

      values.push(nodo.value.toString().replace(/[,.]/g, ''));
    }

    label.push(this.dataTierCero[1].year);

    values.push(this.dataTierCero[1].value.toString().replace(/,/g, ''));

    let arr = values;

    // Convertir todos los elementos a números
    arr = arr.map(Number);

    let ultimoValor: any = arr[arr.length - 1];

    let sumaSinUltimo: any = arr
      .slice(0, -1)
      .reduce((acc: any, val: any) => acc + val, 0);

    console.log(arr, 'NODES');

    if (sumaSinUltimo === ultimoValor) {
    } else {
      let diferencia: any = ultimoValor - sumaSinUltimo;

      arr.splice(arr.length - 1, 0, +diferencia);

      /* arr[arr.length - 2] += diferencia; */
      /* label[arr.length - 2] = 'Other'; */
      label.splice(arr.length - 2, 0, 'Other');
    }

    let arrString = arr.map(String);
    const mean = new Array(arr.length).fill('');

    // Asignar "total" al último elemento del nuevo array
    mean[mean.length - 1] = 'total';
    mean[0] = 'absolute';

    console.log(mean);

    const data = [
      {
        name: 'Waterfall',
        type: 'waterfall',
        orientation: 'v',
        measure: mean,
        x: label,
        textposition: 'outside',
        text: arrString,
        y: arr,
        totals: { marker: { color: 'gray' } },
        increasing: { marker: { color: '#2cb02c' } },
        connector: {
          line: {
            color: 'rgb(63, 63, 63)',
          },
        },
      },
    ];
    /*     var data = [

      {
  
        type: "waterfall",
  
        x: [
  
          ["2016", "2017", "2017", "2017", "2017", "2018", "2018", "2018", "2018"],
  
          ["initial", "q1", "q2", "q3", "total", "q1", "q2", "q3", "total" ]
  
        ],
  
        measure: ["absolute", "relative", "relative", "relative", "total", "relative", "relative", "relative", "total"],
  
        y: [10, 20, 30, -10, null, 10, 20, -40, null],
  
        base: 300,
  
      decreasing: { marker: { color: "Maroon" , line:{color : "red", width :2}}},
  
      increasing: { marker: { color: "Teal"} },
  
      totals: { marker: { color: "deep sky blue", line:{color:'blue',width:3}} }
  
      }]; */
    const layout = {
      title: {
        text: 'Waterfall Chart',
      },
      xaxis: {
        type: 'category',
      },
      yaxis: {
        type: 'linear',
      },
      autosize: true,
      showlegend: true,
    };

    Plotly.newPlot('myDiv', data, layout);

    setTimeout(()=>{
      Plotly.restyle('myDiv', {'marker.color':['blue']}, [0]);
    },1000)

    /*     if (this.chart) {
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
    }); */
  }

  receiveNodes(eventData: any) {
    this.selectedNodes = eventData;

    this.renderchart();
  }
}
