import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Chart, registerables } from 'node_modules/chart.js';
import Swal from 'sweetalert2';
Chart.register(...registerables);

@Component({
  selector: 'app-simulate',
  providers: [ProjectService],
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulate.component.html',
  styleUrl: './simulate.component.scss',
})
export class SimulateComponent implements OnInit {
  id!: any;
  nodes: any[] = [];
  isSelectedAll: boolean = false;
  simulateName: string = 'simulation Name';
  simulateDescription: string = 'simulation description';
  simulationNumber: number = 10000;
  editSimulation: boolean = false;
  tierCero: any;
  chart: any;
  arraySamples: any[] = [];
  percentiles: any[] = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
  values: any[] = [];
  colorBar: any = '#8C64B1';
  colorsOption: any[] = [
    '#8C64B1',
    '#6c757d',
    '#ffc107',
    '#007bff',
    '#dc3545',
    '#17a2b8',
    '#28a745 ',
  ];

  constructor(
    private projectSvc: ProjectService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.projectSvc.getProject(this.id).subscribe((res: any) => {
      this.nodes = res.nodes;
      this.tierCero = res.nodes.find((node: any) => node.tier == 0);
      const result = eval(this.tierCero.formula.join(''));
      console.log(result, 'result');
      this.simulationChart();
    });
  }

  toggleActive(node: any) {
    node.isActive = !node.isActive;
    this.getNumberOfActiveNodes();
  }

  toggleSelectAll() {
    this.isSelectedAll = !this.isSelectedAll;
    console.log(this.nodes);
    this.nodes.forEach((node) => (node.isActive = this.isSelectedAll));
  }

  getNumberOfActiveNodes(): number {
    return this.nodes.filter((node) => node.isActive).length;
  }

  editSimulationClick() {
    if (this.disable()) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre y numero de simulaciones son necesarios',
        icon: 'error',
        iconColor: '#BC5800',
        customClass: {
          confirmButton: 'confirm',
        },
      }).then((result) => {});
    } else {
      this.editSimulation = !this.editSimulation;
    }
  }

  resetData() {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'Los datos de la simulacion seran borrados.',
      icon: 'question',
      iconColor: '#BC5800',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'confirm',
        cancelButton: 'cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.editSimulation = true;
        this.simulateDescription = '';
        this.simulationNumber = 0;
        this.simulateName = '';
      }
    });
  }

  generateSimulation() {
    let formula: any = [];
    let arrayToSee = [];
    for (let i = 0; i < 1000; i++) {
      for (let i = 0; i < this.tierCero.formula.length; i++) {
        const nodeId = this.tierCero.formula[i];

        const node = this.nodes.find((node: any) => node.id == nodeId);

        // console.log(node);

        if (typeof nodeId === 'number') {
          if (!node.isActive || node.isActive == false) {
            formula.push(node.unite == null || undefined ? '0' : node.unite);
          } else {
            switch (node.distribution_shape[0].name) {
              case 'Uniforme':
                const randomNumber = this.uniformOperation(
                  node.distribution_shape[0].min,
                  node.distribution_shape[0].max
                );
                formula.push(randomNumber);
                break;

              case 'Normal':
                const randomNumberNormal = this.normalOperation(
                  node.distribution_shape[0].mean,
                  node.distribution_shape[0].stDev
                );
                formula.push(randomNumberNormal);
                break;

              case 'Exponencial':
                const randomNumberExponential = this.exponentialOperation(
                  node.distribution_shape[0].rate
                );
                formula.push(randomNumberExponential);
                break;

              default:
                break;
            }
          }
        } else {
          formula.push(nodeId);
        }
      }

      const operation = eval(formula.join(''));

      arrayToSee.push(operation);

      formula = [];
    }
    this.arraySamples = arrayToSee;
    console.log(arrayToSee);
    if (this.chart) {
      this.chart.destroy();
    }
    this.simulationChart();
  }

  saveSimulationData() {
    if (this.disable()) {
      Swal.fire({
        title: 'Error',
        text: 'El nombre y numero de simulaciones son necesarios',
        icon: 'error',
        iconColor: '#BC5800',
        customClass: {
          confirmButton: 'confirm',
        },
      }).then((result) => {});
    } else {
      this.editSimulation = !this.editSimulation;
    }
  }

  disable() {
    if (this.simulateName && this.simulationNumber > 0) {
      return false;
    } else {
      return true;
    }
  }

  uniformOperation(minValue: any, maxValue: any) {
    const min = +minValue;
    const max = +maxValue;

    // Generar muestras de la distribución
    var s = [];
    for (var i = 0; i < +this.simulationNumber; i++) {
      s.push(min + Math.random() * (max - min));
    }

    // Verificar que todos los valores están dentro del intervalo dado
    console.log(s.every((value) => value >= min && value < max));

    var binWidth = (max - min) / 15;
    /*// Crear el histograma
    var histogram = new Array(15).fill(0);
    for (var i = 0; i < s.length; i++) {
      histogram[Math.floor((s[i] - min) / ((max - min) / 15))]++;
    }

    // Normalizar el histograma
    histogram = histogram.map(function (value) {
      return value / (binWidth * s.length);
    });*/

    const arrayOperation = Array.from({ length: 15 }, (_, i) =>
      (min + i * binWidth).toFixed(2)
    );

    return arrayOperation[Math.floor(Math.random() * arrayOperation.length)];
  }

  normalOperation(meanOperation: any, stDevOperation: any) {
    // Definir la media y la desviación estándar
    var mu = +meanOperation,
      sigma = +stDevOperation,
      samples = +this.simulationNumber;

    // Generar una distribución normal
    // Generar una distribución normal
    var s = [];
    for (var i = 0; i < samples; i++) {
      s.push(
        mu +
          sigma *
            Math.sqrt(-2.0 * Math.log(Math.random())) *
            Math.cos(2.0 * Math.PI * Math.random())
      );
    }
    // Crear el histograma
    /*var histogram = new Array(samples).fill(0);
    for (var i = 0; i < s.length; i++) {
      histogram[Math.floor(((s[i] - mu + 5 * sigma) / (10 * sigma)) * 100)]++;
    }

    var binWidth = (10 * sigma) / 100;
    histogram = histogram.map(function (value) {
      return value / (binWidth * s.length);
    });*/

    // Crear la curva de la función de densidad de probabilidad
    var x = Array.from({ length: 100 }, (_, i) =>
      (mu - 5 * sigma + (i * (10 * sigma)) / 100).toFixed(2)
    );

    return x[Math.floor(Math.random() * x.length)];
  }

  exponentialOperation(rateOperation: any) {
    // Escala de la distribución exponencial
    let rate = +rateOperation; // Cambia este valor para ajustar la escala

    // Dibujar muestras de la distribución exponencial
    let s = [];
    for (let i = 0; i < +this.simulationNumber; i++) {
      s.push(-rate * Math.log(1.0 - Math.random()));
    }

    // Crear el histograma
    let histogram = new Array(50).fill(0);
    for (let i = 0; i < s.length; i++) {
      histogram[Math.min(Math.floor(s[i] / (10 / 50)), histogram.length - 1)]++;
    }

    // Normalizar el histograma
    let binWidth = 10 / 50;
    histogram = histogram.map((value) => value / (binWidth * s.length));

    // Crear bins para el histograma
    let bins = Array.from({ length: histogram.length }, (_, i) =>
      (i * binWidth).toFixed(2)
    );

    return bins[Math.floor(Math.random() * bins.length)];
  }

  simulationChart() {
    // Realizar una simulación de Montecarlo de 10000 muestras
    var muestras = this.arraySamples;

    const conteos: any = {};

    muestras = muestras.sort((a, b) => a - b);

    // Decide cuántos datos quieres en tu muestra
    const numMuestra = +this.simulationNumber;

    // Crea una nueva array para tu muestra
    const newmuestra = [];

    // Llena tu muestra con datos aleatorios de tus datos originales
    for (let i = 0; i < numMuestra; i++) {
      const index = Math.floor(Math.random() * muestras.length);
      newmuestra.push(muestras[index]);
    }

    newmuestra.forEach((muestra) => {
      if (conteos[muestra]) {
        conteos[muestra]++;
      } else {
        conteos[muestra] = 1;
      }
    });

    // Calcular los percentiles
    const percentiles = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    this.values = percentiles.map((percentil) => {
      const index = Math.floor((percentil / 100) * (muestras.length - 1));
      return muestras.sort((a, b) => a - b)[index];
    });

    const etiquetas = Object.keys(conteos).sort(
      (a, b) => Number(a) - Number(b)
    );

    // const datosY = Object.values(conteos).sort((a,b) => Number(a) - Number(b));
    const datosY = Array.from(
      { length: Object.values(conteos).length },
      (_, i) => '-'
    );

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: datosY,
        datasets: [
          {
            label: 'Simulación Montecarlo',
            data: etiquetas,
            backgroundColor: this.colorBar,
            borderColor: 'rgba(140, 100, 177, 1)',
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

    // Crear una lista HTML con los percentiles
    const lista: any = document.getElementById('percentiles');
    percentiles.forEach((p, i) => {
      const li = document.createElement('li');
      li.textContent = `El ${p}% de los valores son menores que ${this.values[i]}`;
      lista.appendChild(li);
    });
  }

  selectColor(color: string, event: any) {
    if (this.editSimulation) {
      this.colorBar = color;

      if (this.chart) {
        this.chart.destroy();
      }
      this.simulationChart();
    } else {
    }
  }

  elimateSimulation() {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'No podras revertir esta accion',
      icon: 'question',
      iconColor: '#BC5800',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'confirm',
        cancelButton: 'cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        /*         this.projectSvc.deleteNode(this.nodeId).subscribe((res: any) => {
         
          Swal.fire({
            title: 'Borrado!',
            text: 'El nodo fue borrado con exito!',
            icon: 'success',
          });
          
        }); */
      }
    });
  }
}
