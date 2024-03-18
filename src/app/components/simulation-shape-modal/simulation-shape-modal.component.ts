import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { NgZone } from '@angular/core';
import { FormsModule } from '@angular/forms';
Chart.register(...registerables);
declare var bootstrap: any;
@Component({
  selector: 'app-simulation-shape-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './simulation-shape-modal.component.html',
  styleUrl: './simulation-shape-modal.component.scss',
})
export class SimulationShapeModalComponent implements OnInit {
  @ViewChild('shapeModalSimulation') miModal!: ElementRef;
  clickedElement: number = 0;
  route: string = 'back';
  shapes: any[] = [
    { name: 'Normal', img: '../../../assets/img/Rectangle-shape.png' },
    { name: 'Uniforme', img: '../../../assets/img/rectangle_uniform.png' },
    {
      name: 'Exponential',
      img: '../../../assets/img/rectangle_exponential.png',
    },
  ];
  chart!: any;
  shapeType!: any;
  min: number = 0;
  max: number = 0;
  stDev: number = 0;
  rate!: any;
  mean: number = 0;
  type: string = 'static';
  size: number = 100;
  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {
      this.ngZone.run(() => {
        this.shapeType = this.getItem('shapetype');
        const shapeData: any = this.getItem('shapeData');

        this.min = shapeData?.__zone_symbol__value.min
          ? shapeData?.__zone_symbol__value.min
          : 0;
        this.max = shapeData?.__zone_symbol__value.max
          ? shapeData?.__zone_symbol__value.max
          : 0;
        this.stDev = shapeData?.__zone_symbol__value.stDev
          ? shapeData?.__zone_symbol__value.stDev
          : 0;
        this.rate = shapeData?.__zone_symbol__value.rate
          ? shapeData?.__zone_symbol__value.rate
          : 0;

        this.mean = shapeData?.__zone_symbol__value.mean
          ? shapeData?.__zone_symbol__value.mean
          : 0;

        if (this.shapeType.__zone_symbol__value.name === 'Normal') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.normalChart();
        }

        if (this.shapeType.__zone_symbol__value.name === 'Uniforme') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.uniformChart();
        }

        if (this.shapeType.__zone_symbol__value.name === 'Exponencial') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.exponentialChart();
        }
      });
    });

    modal._element.addEventListener('hidden.bs.modal', () => {
      console.log(this.route);
      const openButtonSave = document.querySelector('#exampleModalButton');
      const openButtoBack = document.querySelector('#shapeModalButton');

      if (this.route === 'back') {
        if (openButtoBack) {
          // Simula un clic en el botón para cerrar el modal
          (openButtoBack as HTMLElement).click();
        }
      } else if (this.route === 'save') {
        this.route = 'back';
        if (openButtonSave) {
          // Simula un clic en el botón para cerrar el modal
          (openButtonSave as HTMLElement).click();
        }
      }
    });
  }

  save() {
    const formShape = {
      min: this.min,
      mean: this.mean,
      rate: this.rate,
      stDev: this.stDev,
      max: this.max,
      name: this.shapeType.__zone_symbol__value.name,
      type: this.type,
    };
    localStorage.setItem('shapeData', JSON.stringify(formShape));
    console.log(formShape);
    this.route = 'save';
    this.min = 0;
    this.max = 0;
    this.stDev = 0;
  }

  getItem(key: any) {
    return new Promise((resolve) => {
      const value = localStorage.getItem(key);
      resolve(JSON.parse(value || ''));
    });
  }

  normalChart() {
    // Definir la media y la desviación estándar
    var mu = +this.mean,
      sigma = +this.stDev,
      samples = 10000;

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
    console.log(histogram);

    // Crear la curva de la función de densidad de probabilidad
    var x = Array.from({ length: 100 }, (_, i) =>
      (mu - 5 * sigma + (i * (10 * sigma)) / 100).toFixed(2)
    );
    var y = x.map(function (x) {
      return (
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-((+x - mu) ** 2) / (2 * sigma ** 2))
      );
    });

    // Crear el gráfico

    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: x,
        datasets: [
          {
            label: 'Histogram',
            data: histogram,
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            borderColor: 'rgba(0, 0, 255, 1)',
            borderWidth: 1,
          },
          {
            label: 'PDF',
            data: y,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: {
            beginAtZero: true,
            ticks: {},
          },
          y: {
            display: false,
          },
        },
      },
    });
  }

  uniformChart() {
    // Generar muestras de la distribución
    var s = [];
    for (var i = 0; i < 10000; i++) {
      s.push(+this.min + Math.random() * (+this.max - +this.min));
    }

    // Verificar que todos los valores están dentro del intervalo dado
    console.log(s.every((value) => value >= -1 && value < 0));

    // Crear el histograma
    var histogram = new Array(15).fill(0);
    for (var i = 0; i < s.length; i++) {
      histogram[Math.floor((s[i] + 1) / (1 / 15))]++;
    }

    // Normalizar el histograma
    var binWidth = 1 / 15;
    histogram = histogram.map(function (value) {
      return value / (binWidth * s.length);
    });

    // Crear el gráfico

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: Array.from({ length: 15 }, (_, i) =>
          (+this.min + i * binWidth).toFixed(2)
        ),
        datasets: [
          {
            type: 'line',
            label: 'PDF',
            fill: false,
            data: Array.from({ length: 15 }, () => 1),
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 2,
          },
          {
            label: 'Histogram',
            data: histogram,
            backgroundColor: 'rgba(0, 0, 255, 0.5)',
            borderColor: 'rgba(0, 0, 255, 1)',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            display: false,
          },
          yAxes: {
            beginAtZero: true,
            ticks: {},
          },
        },
      },
    });
  }

  exponentialChart() {
    // Valores de x en el rango deseado
    const xValuesExp = [];
    for (let x = 0; x <= 10; x += 0.1) {
      xValuesExp.push(x);
    }

    // Calcula la PDF para cada valor de x
    const exponentialValues = xValuesExp.map((x) => {
      const pdf = +this.rate * Math.exp(-+this.rate * x);
      return pdf;
    });

    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: xValuesExp,
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: 'Distribución Exponencial',
            data: exponentialValues,

            borderWidth: 1,

            // dragData: false // prohibit dragging this dataset
            // same as returning `false` in the onDragStart callback
            // for this datsets index position
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'PDF',
            },
          },
        },
      },
    });
  }

  changeValueNormal() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.normalChart();
  }

  changeValueExponential() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.exponentialChart();
  }

  changeValueUniforme() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.uniformChart();
  }
  generateNormalDistributionData(mean: number, stDev: number) {
    const labels = [];
    const values = [];

    for (let x = 0; x <= 10; x += 0.1) {
      const y = this.normalDistribution(x, mean, stDev);
      labels.push(x.toFixed(2));
      values.push(y.toFixed(4));
    }

    return { labels, values };
  }

  normalDistribution(x: number, mean: number, stDev: number) {
    const factor = 1 / (stDev * Math.sqrt(2 * Math.PI));
    const exponent = -0.5 * Math.pow((x - mean) / stDev, 2);
    return factor * Math.exp(exponent);
  }

  exponentialDistribution(x: number, rate: number) {
    return rate * Math.exp(-rate * x);
  }

  generateExponentialDistributionData(rate: number) {
    const numPoints = 10; // Número de puntos de datos
    const labels: string[] = [];
    const values: number[] = [];

    for (let i = 1; i <= numPoints; i++) {
      const randomValue = Math.random();
      const exponentialValue = -Math.log(1 - randomValue) / rate;
      values.push(Number(exponentialValue.toFixed(2))); // Convertir a número
      labels.push(`Point ${i}`);
    }

    return { labels, values };
  }

  generateUniformDistributionData(min: number, max: number) {
    const labels = [];
    const values = [];

    for (let x = min; x <= max; x += 10) {
      const y = this.uniformDistribution(x, min, max);
      labels.push(x.toFixed(2));
      values.push(y.toFixed(4));
    }

    return { labels, values };
  }

  uniformDistribution(x: number, min: number, max: number) {
    if (x >= min && x <= max) {
      return 1 / (max - min);
    } else {
      return 0;
    }
  }
}
