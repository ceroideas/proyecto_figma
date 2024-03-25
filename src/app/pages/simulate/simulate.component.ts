import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { Chart, registerables } from 'node_modules/chart.js';
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
    this.editSimulation = !this.editSimulation;
  }

  resetData() {
    this.editSimulation = true;
    this.simulateDescription = '';
    this.simulationNumber = 0;
    this.simulateName = '';
  }

  generateSimulation() {
    let formula = [];
    let arrayToSee = [];
    for (let i = 0; i < 1000; i++) {
      for (let i = 0; i < this.tierCero.formula.length; i++) {
        const nodeId = this.tierCero.formula[i];

        const node = this.nodes.find((node: any) => node.id == nodeId);

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
    this.simulationChart();
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

    // Crear el histograma
    var histogram = new Array(15).fill(0);
    for (var i = 0; i < s.length; i++) {
      histogram[Math.floor((s[i] - min) / ((max - min) / 15))]++;
    }

    // Normalizar el histograma
    var binWidth = (max - min) / 15;
    histogram = histogram.map(function (value) {
      return value / (binWidth * s.length);
    });

    const arrayOperation = Array.from(
      { length: +this.simulationNumber },
      (_, i) => (min + i * binWidth).toFixed(2)
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
    var histogram = new Array(samples).fill(0);
    for (var i = 0; i < s.length; i++) {
      histogram[Math.floor(((s[i] - mu + 5 * sigma) / (10 * sigma)) * 100)]++;
    }

    var binWidth = (10 * sigma) / 100;
    histogram = histogram.map(function (value) {
      return value / (binWidth * s.length);
    });

    // Crear la curva de la función de densidad de probabilidad
    var x = Array.from({ length: +this.simulationNumber }, (_, i) =>
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
    let histogram = new Array(+this.simulationNumber).fill(0);
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
    const muestras = this.arraySamples;
    const samples = 26;
    console.log(muestras);
    // Crear un histograma con samples bins para reducir la cantidad de valores
    const conteos = Array(samples).fill(0);
    muestras.forEach((muestra) => {
      const bin = Math.floor(muestra * samples);
      conteos[bin]++;
    });

    // Calcular los percentiles
    const percentiles = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
    const valores = percentiles.map((percentil) => {
      const index = Math.floor((percentil / 100) * (conteos.length - 1));
      console.log(index);
      return conteos.sort((a, b) => a - b)[index];
    });

    // Crear las etiquetas del eje X con letras de la A a la Z
    const etiquetas = Array.from({ length: samples }, (_, i) =>
      String.fromCharCode(65 + i)
    );

    // Configurar el gráfico de barras con Chart.js

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: etiquetas,
        datasets: [
          {
            label: 'Simulación Montecarlo',
            data: conteos,
            borderColor: 'black',
            borderWidth: 1,
          },
        ],
      },
    });

    // Crear una lista HTML con los percentiles
    const lista: any = document.getElementById('percentiles');
    percentiles.forEach((p, i) => {
      const li = document.createElement('li');
      li.textContent = `El ${p}% de los valores son menores que ${valores[i]}`;
      lista.appendChild(li);
    });
  }
}
