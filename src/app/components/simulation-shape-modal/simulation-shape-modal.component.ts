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
  min: any = 0;
  mode: any = 0;
  max: any = 0;
  stDev: number = 0;
  rate!: any;
  mean: number = 0;
  type: string = 'static';
  size: number = 100;
  lamda: number = 0;
  trials: number = 0;
  probability: number = 0;
  form: number = 0;
  scale: number = 0;
  alpha: number = 0;
  beta: number = 0;
  success: number = 0;

  population = 0;
  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {
      this.ngZone.run(() => {
        this.shapeType = this.getItem('shapetype');
        const shapeData: any = this.getItem('shapeData');

        this.min = shapeData?.__zone_symbol__value.min
          ? +shapeData?.__zone_symbol__value.min
          : 0;
        this.max = shapeData?.__zone_symbol__value.max
          ? +shapeData?.__zone_symbol__value.max
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

        this.mode = shapeData?.__zone_symbol__value.mode
          ? shapeData?.__zone_symbol__value.mode
          : 0;

        this.lamda = shapeData?.__zone_symbol__value.lamda
          ? shapeData?.__zone_symbol__value.lamda
          : 0;

        this.trials = shapeData?.__zone_symbol__value.trials
          ? shapeData?.__zone_symbol__value.trials
          : 0;

        this.probability = shapeData?.__zone_symbol__value.probability
          ? shapeData?.__zone_symbol__value.probability
          : 0;

        this.scale = shapeData?.__zone_symbol__value.scale
          ? shapeData?.__zone_symbol__value.scale
          : 0;

        this.form = shapeData?.__zone_symbol__value.form
          ? shapeData?.__zone_symbol__value.form
          : 0;

        this.alpha = shapeData?.__zone_symbol__value.alpha
          ? shapeData?.__zone_symbol__value.alpha
          : 0;

        this.beta = shapeData?.__zone_symbol__value.beta
          ? shapeData?.__zone_symbol__value.beta
          : 0;
        this.success = shapeData?.__zone_symbol__value.success
          ? shapeData?.__zone_symbol__value.success
          : 0;

        this.population = shapeData?.__zone_symbol__value.population
          ? shapeData?.__zone_symbol__value.population
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

        if (this.shapeType.__zone_symbol__value.name === 'Triangular') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.triangularChart();
        }

        if (this.shapeType.__zone_symbol__value.name === 'Poisson') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.poissonChart();
        }

        if (this.shapeType.__zone_symbol__value.name === 'Binominal') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.binomialChart();
        }

        if (this.shapeType.__zone_symbol__value.name === 'Weibull') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.weibullChart();
        }

        if (this.shapeType.__zone_symbol__value.name === 'Geometric') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.geometricalChart();
        }

        if (this.shapeType.__zone_symbol__value.name === 'Beta') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.betaChart();
        }

        if (this.shapeType.__zone_symbol__value.name === 'Hypergeometric') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.hypergeometricChart();
        }
      });
    });

    modal._element.addEventListener('hidden.bs.modal', () => {
      console.log(this.route);
      const openButtonSave = document.querySelector('#exampleModalButton');
      const openButtoBack = document.querySelector('#shapeModalButton');

      if (this.route === 'back') {
        if (openButtoBack) {
          (openButtoBack as HTMLElement).click();
        }
      } else if (this.route === 'save') {
        this.route = 'back';
        if (openButtonSave) {
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
      mode: this.mode,
      lamda: this.lamda,
      trials: this.trials,
      probability: this.probability,
      alpha: this.alpha,
      beta: this.beta,
      form: this.form,
      success: this.success,
      population: this.population,
      scale: this.scale,
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
    if (this.mean.toString().includes('%')) {
      const valueBase = parseFloat(this.mean.toString().replace('%', ''));

      this.mean = +valueBase / 100;
    }

    if (this.stDev.toString().includes('%')) {
      const valueBase = parseFloat(this.stDev.toString().replace('%', ''));

      this.stDev = +valueBase / 100;
    }
    var mu = +this.mean,
      sigma = +this.stDev,
      samples = 1000;

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
    var x = Array.from({ length: 100 }, (_, i) =>
      (mu - 5 * sigma + (i * (10 * sigma)) / 100).toFixed(2)
    );
    var y = x.map(function (x) {
      return (
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-((+x - mu) ** 2) / (2 * sigma ** 2))
      );
    });

    console.log(x);

    // Crear el gráfico

    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: x,
        datasets: [
          {
            label: 'PDF',
            data: y,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 1,
          },
          {
            type: 'bar',
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

  triangularChart() {
    console.log(this.min, this.max, this.mode, 'MODE');
    // Función para generar números aleatorios con distribución triangular
    function triangularDistribution(
      sampleSize: any,
      low: number,
      mode: number,
      high: number
    ) {
      const triangularSamples = [];
      for (let i = 0; i < sampleSize; i++) {
        const u = Math.random();
        const f = (mode - low) / (high - low);
        if (u <= f) {
          triangularSamples.push(
            low + Math.sqrt(u * (high - low) * (mode - low))
          );
        } else {
          triangularSamples.push(
            high - Math.sqrt((1 - u) * (high - low) * (high - mode))
          );
        }
      }
      return triangularSamples;
    }

    // Definir parámetros de la distribución triangular
    const sampleSize = 1000;

    // Generar números aleatorios con distribución triangular
    const triangularSamples = triangularDistribution(
      sampleSize,
      +this.min,
      +this.mode,
      +this.max
    );
    console.log(triangularSamples, 'SAMPLES');

    // Calcular el histograma
    const numBins = 20; // Número de bins para el histograma
    const binWidth = (+this.max - +this.min) / numBins;
    const histogram = new Array(numBins).fill(0);

    triangularSamples.forEach((value) => {
      if (value >= +this.min && value <= +this.max) {
        const binIndex = Math.floor((value - +this.min) / binWidth);
        histogram[binIndex]++;
      }
    });

    // Preparar datos para el histograma
    const labels = Array.from(
      { length: numBins },
      (_, i) => +(+this.min + i * binWidth).toFixed(2)
    );

    console.log(labels, 'SALEBL');
    const data = histogram;

    // Crear un histograma con Chart.js (gráfico de barras)

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Triangular Distribution',
            data: data,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Value',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency',
            },
            ticks: {},
          },
        },
      },
    });
  }

  poissonChart() {
    // Función para generar números aleatorios con distribución de Poisson
    function poissonDistribution(sampleSize: any, lambda: any) {
      const poissonSamples = [];
      for (let i = 0; i < sampleSize; i++) {
        let L = Math.exp(-lambda);
        let k = 0;
        let p = 1.0;
        do {
          k++;
          p *= Math.random();
        } while (p > L);
        poissonSamples.push(k - 1);
      }
      return poissonSamples;
    }

    // Definir parámetros de la distribución de Poisson
    const sampleSize = 1000;
    const lambda = 8; // Parámetro lambda

    // Generar números aleatorios con distribución de Poisson
    const poissonSamples = poissonDistribution(sampleSize, this.lamda);
    console.log(poissonSamples);

    // Calcular el histograma
    const maxVal = Math.max(...poissonSamples);
    const minVal = Math.min(...poissonSamples);
    const numBins = maxVal - minVal + 1;
    /* const histogram = new Array(numBins).fill(0); */

    /*     poissonSamples.forEach((value) => {
      histogram[value - minVal]++;
    }); */

    let histogram = new Array(14).fill(0);
    for (let i = 0; i < poissonSamples.length; i++) {
      histogram[
        Math.min(Math.floor(poissonSamples[i]), histogram.length - 1)
      ]++;
    }

    // Normaliza el histograma
    for (let i = 0; i < histogram.length; i++) {
      histogram[i] /= poissonSamples.length;
    }

    // Preparar datos para el histograma
    const labels = Array.from({ length: numBins }, (_, i) => i + minVal);
    const data = histogram;

    // Crear un histograma con Chart.js (gráfico de barras)

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: Array.from({ length: histogram.length }, (_, i) => i + 1),
        datasets: [
          {
            label: 'Poisson Distribution',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Value',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency',
            },
            ticks: {},
          },
        },
      },
    });
  }

  geometricalChart() {
    // Parámetros de la distribución geométrica
    const p = this.probability == 0 ? 0.1 : this.probability; // Probabilidad de éxito en cada intento
    const size = 10000; // Tamaño de la muestra

    // Generar muestras de la distribución geométrica
    const samples = Array.from({ length: size }, () => {
      let attempts = 1;
      while (Math.random() >= p) {
        attempts++;
      }
      return attempts;
    });

    console.log(samples, 'SAMPES');

    // Calcular el histograma de las muestras
    const histogramData = samples.reduce((histogram: any, value: any) => {
      histogram[value] = (histogram[value] || 0) + 1;
      return histogram;
    }, {});

    // Convertir el histograma en un formato compatible con Chart.js
    const chartData = {
      labels: Object.keys(histogramData).map((bin) => parseInt(bin)),
      datasets: [
        {
          label: 'Histograma',
          data: Object.values(histogramData).map((count: any) => count / size),
          backgroundColor: '#8C64B1',
          borderColor: '#8C64B1',
          borderWidth: 1,
        },
      ],
    };

    // Configurar opciones del gráfico
    const chartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Número de intentos hasta el primer éxito',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Probabilidad',
          },
        },
      },
    };

    // Crear el gráfico de barras usando Chart.js

    this.chart = new Chart('chart', {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });
  }

  betaChart() {
    // Parámetros de la distribución beta
    const alpha = this.alpha; // Parámetro de forma
    const beta = this.beta; // Parámetro de forma
    const size = 1000; // Tamaño de la muestra

    // Generar muestras de la distribución beta
    const samples = Array.from({ length: size }, () => {
      return Math.random() ** alpha * (1 - Math.random()) ** beta;
    });

    // Histograma de las muestras generadas
    const bins = 50;
    const histogramData = Array.from({ length: bins }, (_, i) => {
      const binStart = i / bins;
      const binEnd = (i + 1) / bins;
      return (
        samples.filter((value) => value >= binStart && value < binEnd).length /
        size
      );
    });

    // Función de densidad de probabilidad de la distribución beta
    function betaPDF(x: any, alpha: any, beta: any) {
      return (
        (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) /
        (Math.pow(1, alpha - 1) * Math.pow(1, beta - 1))
      );
    }

    // Datos para trazar la función de densidad de probabilidad
    const pdfData = {
      labels: [] as string[],
      datasets: [
        {
          label: 'Distribución Beta',
          data: [] as number[],
          fill: false,
          backgroundColor: '#8C64B1',
          borderColor: '#8C64B1',
          tension: 0.1,
        },
      ],
    };

    // Generar puntos para la función de densidad de probabilidad
    for (let i = 0; i <= 1; i += 0.01) {
      pdfData.labels.push(i.toFixed(2)); // Redondeamos para evitar números largos
      pdfData.datasets[0].data.push(betaPDF(i, alpha, beta));
    }

    // Configurar opciones del gráfico
    const options = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Valor',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Densidad de probabilidad',
          },
        },
      },
    };

    // Crear el gráfico de línea para la función de densidad de probabilidad

    this.chart = new Chart('chart', {
      type: 'bar',
      data: pdfData,
      options: options,
    });

    // Añadir el histograma como un gráfico de barras en la parte derecha
    this.chart.data.datasets.push({
      label: 'Histograma',
      data: histogramData,
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderWidth: 1,
      type: 'bar',
      yAxisID: 'histogram-axis',
    });

    // Ajustar las opciones del eje y para el histograma
    this.chart.options.scales.yAxes.push({
      id: 'histogram-axis',
      display: false,
      stacked: false,
    });
  }

  hypergeometricChart() {
    // Parámetros de la distribución hipergeométrica
    const M = this.population; // Tamaño de la población
    const n = this.success; // Número de éxitos en la población
    const N = this.trials; // Tamaño de la muestra

    // Generar muestras de la distribución hipergeométrica
    const samples = Array.from({ length: 1000 }, () => {
      let successCount = 0;
      for (let i = 0; i < N; i++) {
        if (Math.random() < n / M) {
          successCount++;
        }
      }
      return successCount;
    });

    // Calcular el histograma de las muestras generadas
    const bins = Array.from(new Set(samples)).sort((a, b) => a - b);
    const histogramData = bins.map(
      (bin) => samples.filter((value) => value === bin).length / samples.length
    );

    // Configurar los datos para el gráfico
    const data = {
      labels: bins,
      datasets: [
        {
          label: 'Distribución Hipergeométrica',
          data: histogramData,
          backgroundColor: '#8C64B1',
          borderColor: '#8C64B1',
          borderWidth: 1,
        },
      ],
    };

    // Configurar opciones del gráfico
    const options = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Valor',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Densidad de probabilidad',
          },
        },
      },
    };

    // Crear el gráfico de barras usando Chart.js

    this.chart = new Chart('chart', {
      type: 'bar',
      data: data,
      options: options,
    });
  }

  binomialChart() {
    // Función para generar números aleatorios con distribución binomial
    function binomialDistribution(sampleSize: any, n: any, p: any) {
      const binomialSamples = [];
      for (let i = 0; i < sampleSize; i++) {
        let successes = 0;
        for (let j = 0; j < n; j++) {
          if (Math.random() < p) {
            successes++;
          }
        }
        binomialSamples.push(successes);
      }
      return binomialSamples;
    }

    // Definir parámetros de la distribución binomial
    const sampleSize = 1000;
    const n = 10; // Número de ensayos
    const p = 0.5; // Probabilidad de éxito en cada ensayo

    // Generar números aleatorios con distribución binomial
    const binomialSamples = binomialDistribution(
      sampleSize,
      this.trials,
      this.probability
    );

    // Calcular el histograma
    const maxVal = Math.max(...binomialSamples);
    const minVal = Math.min(...binomialSamples);
    const numBins = maxVal - minVal + 1;
    const histogram = new Array(numBins).fill(0);

    binomialSamples.forEach((value) => {
      histogram[value - minVal]++;
    });

    // Preparar datos para el histograma
    const labels = Array.from({ length: numBins }, (_, i) => i + minVal);
    const data = histogram;

    // Crear un histograma con Chart.js (gráfico de barras)

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Binomial Distribution',
            data: data,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Number of Successes',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency',
            },
            ticks: {},
          },
        },
      },
    });
  }

  weibullChart() {
    // Tus códigos
    var a = 5; // shape
    var form = 1;
    var s = Array.from({ length: 1000 }, () =>
      Math.pow(-Math.log(Math.random()), this.form / this.scale)
    );

    // Función weibull
    function weib(x: number, n: number, a: number) {
      return (a / n) * Math.pow(x / n, a - 1) * Math.exp(-Math.pow(x / n, a));
    }

    // Crear la gráfica

    var x = Array.from({ length: 100 }, (_, i) => (i + 1) / 50);
    var y = x.map((val) => weib(val, this.form, this.scale));
    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: x,
        datasets: [
          {
            label: 'Weibull Distribution',
            data: y,
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
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

    console.log(s, 'ido');
  }

  uniformChart() {
    if (this.min.toString().includes('%')) {
      const valueBase = parseFloat(this.min.replace('%', ''));
      console.log('min');

      this.min = +valueBase / 100;
    }

    if (this.max.toString().includes('%')) {
      const valueBase = parseFloat(this.max.replace('%', ''));
      console.log('max');
      this.max = +valueBase / 100;
    }

    var min = +this.min;
    var max = +this.max;

    // Generar muestras de la distribución
    var s = [];
    for (var i = 0; i < 1000; i++) {
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

    // Crear el gráfico

    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: Array.from({ length: 15 }, (_, i) =>
          (min + i * binWidth).toFixed(2)
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
        scales: {},
      },
    });
  }

  exponentialChart() {
    // Escala de la distribución exponencial

    if (this.rate.includes('%')) {
      const valueBase = parseFloat(this.rate.replace('%', ''));

      this.rate = +valueBase / 100;
    }
    let rate = this.rate; // Cambia este valor para ajustar la escala

    // Dibujar muestras de la distribución exponencial
    let s = [];
    for (let i = 0; i < 1000; i++) {
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

    // Crear PDF de la distribución exponencial
    let pdf = bins.map((bin) => Math.exp(-bin));

    // Crear el gráfico con Chart.js
    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: bins,
        datasets: [
          {
            label: 'PDF',
            data: pdf,
            fill: false,
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 1,
            type: 'line',
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

  changeValueHypergeometric() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.hypergeometricChart();
  }

  changeValueGeometrica() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.geometricalChart();
  }

  changeValueBeta() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.betaChart();
  }

  changeValueWeibull() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.weibullChart();
  }

  changeValuePoisson() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.poissonChart();
  }

  changeValueTriangular() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.triangularChart();
  }

  changeValueBinomial() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.binomialChart();
  }
  /*   generateNormalDistributionData(mean: number, stDev: number) {
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
  } */

  uniformDistribution(x: number, min: number, max: number) {
    if (x >= min && x <= max) {
      return 1 / (max - min);
    } else {
      return 0;
    }
  }
}
