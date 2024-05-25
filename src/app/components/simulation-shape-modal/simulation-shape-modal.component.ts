import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, ChartData, ChartOptions, registerables } from 'chart.js';
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

        if (this.shapeType.__zone_symbol__value.name === 'Lognormal') {
          if (this.chart) {
            this.chart.destroy();
          }
          this.lognormalChart();
        }
      });
    });

    modal._element.addEventListener('hidden.bs.modal', () => {
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

    const data = histogram.map((count) => count / sampleSize / binWidth);

    // Calcular la PDF teórica
    const pdf = labels.map((x) => {
      if (x < +this.mode) {
        return (
          (2 * (x - +this.min)) /
          ((+this.max - +this.min) * (+this.mode - +this.min))
        );
      } else {
        return (
          (2 * (+this.max - x)) /
          ((+this.max - +this.min) * (+this.max - +this.mode))
        );
      }
    });

    // Crear un histograma con Chart.js (gráfico de barras) y agregar la PDF
    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'PDF Teórica',
            data: pdf,
            borderColor: '#FF6347',
            borderWidth: 2,
            fill: false,
            type: 'line',
            yAxisID: 'y1',
          },
          {
            label: 'Triangular Distribution',
            data: data,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
            yAxisID: 'y',
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
            position: 'left',
          },
          y1: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Probability Density',
            },
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
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

    // Función para calcular la PMF teórica de la distribución de Poisson
    function poissonPMF(lambda: number, k: number) {
      return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
    }

    // Función para calcular el factorial de un número
    function factorial(n: number): number {
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    }

    // Definir parámetros de la distribución de Poisson
    const sampleSize = 1000;
    const lambda = this.lamda; // Parámetro lambda

    // Generar números aleatorios con distribución de Poisson
    const poissonSamples = poissonDistribution(sampleSize, lambda);

    // Calcular el histograma
    const maxVal = Math.max(...poissonSamples);
    const minVal = Math.min(...poissonSamples);
    const numBins = maxVal - minVal + 1;

    let histogram = new Array(numBins).fill(0);
    for (let i = 0; i < poissonSamples.length; i++) {
      histogram[poissonSamples[i] - minVal]++;
    }

    // Normalizar el histograma
    for (let i = 0; i < histogram.length; i++) {
      histogram[i] /= poissonSamples.length;
    }

    // Calcular la PMF teórica
    const pmf = new Array(numBins)
      .fill(0)
      .map((_, i) => poissonPMF(lambda, i + minVal));

    // Crear un histograma con Chart.js (gráfico de barras) y agregar la PMF
    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: Array.from({ length: histogram.length }, (_, i) => i + minVal),
        datasets: [
          {
            label: 'PMF Teórica',
            data: pmf,
            borderColor: '#FF6347',
            borderWidth: 2,
            fill: false,
            type: 'line',
          },
          {
            label: 'Poisson Distribution',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
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

    // Calcular el histograma de las muestras
    const histogramData = samples.reduce((histogram: any, value: any) => {
      histogram[value] = (histogram[value] || 0) + 1;
      return histogram;
    }, {});

    // Convertir el histograma en un formato compatible con Chart.js
    const labels = Object.keys(histogramData).map((bin) => parseInt(bin));
    const histogram = Object.values(histogramData).map(
      (count: any) => count / size
    );

    // Calcular la PMF teórica
    const pmf = labels.map((k) => p * Math.pow(1 - p, k - 1));

    // Crear el gráfico de barras usando Chart.js y agregar la PMF
    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'PMF Teórica',
            data: pmf,
            borderColor: '#FF6347',
            borderWidth: 2,
            fill: false,
            type: 'line',
          },
          {
            label: 'Histograma',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
          },
        ],
      },
      options: {
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
      },
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
    });
  }

  hypergeometricChart() {
    // Parámetros de la distribución hipergeométrica
    const M = +this.population; // Tamaño de la población
    const n = +this.success; // Número de éxitos en la población
    const N = +this.trials; // Tamaño de la muestra

    // Función de densidad de probabilidad de la distribución hipergeométrica
    function hypergeometricPDF(k: number, M: number, n: number, N: number) {
      const coef =
        (binomialCoefficient(n, k) * binomialCoefficient(M - n, N - k)) /
        binomialCoefficient(M, N);
      return coef;
    }

    // Función para calcular el coeficiente binomial
    function binomialCoefficient(n: number, k: number) {
      let coeff = 1;
      for (let x = n - k + 1; x <= n; x++) coeff *= x;
      for (let x = 1; x <= k; x++) coeff /= x;
      return coeff;
    }

    // Calcular los valores para la función de densidad de probabilidad
    const pdfData = [];
    for (let k = 0; k <= N; k++) {
      pdfData.push(hypergeometricPDF(k, M, n, N));
    }

    // Configurar los datos para el gráfico
    const bins = Array.from({ length: N + 1 }, (_, i) => i);

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
          beginAtZero: true,
        },
      },
    };

    // Crear el gráfico de barras usando Chart.js
    this.chart = new Chart('chart', {
      data: {
        labels: bins,
        datasets: [
          {
            label: 'Histograma de Distribución Hipergeométrica',
            data: pdfData,
            backgroundColor: 'rgba(140, 100, 177, 0.6)',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
            yAxisID: 'y',
          },
          {
            label: 'PDF de Distribución Hipergeométrica',
            data: pdfData,
            borderColor: '#FF6347',
            backgroundColor: '#FF6347',
            borderWidth: 2,
            type: 'line',
            fill: false,
            yAxisID: 'y',
          },
        ],
      },
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

    // Función para calcular la PMF teórica de la distribución binomial
    function binomialPMF(n: number, p: number, k: number) {
      function factorial(x: number): number {
        if (x === 0 || x === 1) return 1;
        return x * factorial(x - 1);
      }
      return (
        (factorial(n) / (factorial(k) * factorial(n - k))) *
        Math.pow(p, k) *
        Math.pow(1 - p, n - k)
      );
    }

    // Definir parámetros de la distribución binomial
    const sampleSize = 1000;
    const n = this.trials; // Número de ensayos
    const p = this.probability; // Probabilidad de éxito en cada ensayo

    // Generar números aleatorios con distribución binomial
    const binomialSamples = binomialDistribution(sampleSize, n, p);

    // Calcular el histograma
    const maxVal = Math.max(...binomialSamples);
    const minVal = Math.min(...binomialSamples);
    const numBins = maxVal - minVal + 1;
    const histogram = new Array(numBins).fill(0);

    binomialSamples.forEach((value) => {
      histogram[value - minVal]++;
    });

    // Normalizar el histograma
    for (let i = 0; i < histogram.length; i++) {
      histogram[i] /= binomialSamples.length;
    }

    // Calcular la PMF teórica
    const labels = Array.from({ length: numBins }, (_, i) => i + minVal);
    const pmf = labels.map((k) => binomialPMF(n, p, k));

    // Crear un histograma con Chart.js (gráfico de barras) y agregar la PMF
    this.chart = new Chart('chart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'PMF Teórica',
            data: pmf,
            borderColor: '#FF6347',
            borderWidth: 2,
            fill: false,
            type: 'line',
          },
          {
            label: 'Binomial Distribution',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
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
              text: 'Probability',
            },
          },
        },
      },
    });
  }

  weibullChart() {
    // Parámetros de la distribución de Weibull
    const k = this.form; // Parámetro de forma
    const lambda = this.scale; // Parámetro de escala
    const sampleSize = 1000;

    // Función para generar números aleatorios con distribución de Weibull
    function generateWeibullSamples(k: number, lambda: number, size: number) {
      const samples: number[] = [];
      for (let i = 0; i < size; i++) {
        const u = Math.random();
        const sample = lambda * Math.pow(-Math.log(1 - u), 1 / k);
        samples.push(sample);
      }
      return samples;
    }

    // Generar los datos de Weibull
    const weibullSamples = generateWeibullSamples(k, lambda, sampleSize);

    // Crear bins para el histograma
    function createHistogram(samples: number[], binCount: number) {
      const max = Math.max(...samples);
      const min = Math.min(...samples);
      const binWidth = (max - min) / binCount;
      const bins = Array(binCount).fill(0);
      samples.forEach((sample: number) => {
        const index = Math.min(
          Math.floor((sample - min) / binWidth),
          binCount - 1
        );
        bins[index]++;
      });
      return bins.map((count) => count / (samples.length * binWidth)); // Densidad de probabilidad
    }

    const binCount = 20;
    const hist = createHistogram(weibullSamples, binCount);

    // Calcular los puntos medios de los bins
    const binEdges = Array.from(
      { length: binCount + 1 },
      (_, i) => i * (Math.max(...weibullSamples) / binCount)
    );
    const binMids = binEdges
      .slice(0, -1)
      .map((edge, index) => ((edge + binEdges[index + 1]) / 2).toFixed(2));

    // Función para calcular la PDF de Weibull
    function weibullPDF(x: number, k: number, lambda: number) {
      return (
        (k / lambda) *
        Math.pow(x / lambda, k - 1) *
        Math.exp(-Math.pow(x / lambda, k))
      );
    }

    // Calcular los valores de la PDF para los puntos medios de los bins
    const pdfValues = binMids.map((x) => weibullPDF(parseFloat(x), k, lambda));

    // Configurar los datos para Chart.js
    const chartData: ChartData<'bar' | 'line', number[], string> = {
      labels: binMids,
      datasets: [
        {
          label: 'Densidad de Probabilidad',
          data: hist,
          backgroundColor: '#8C64B1',
          borderColor: '#8C64B1',
          borderWidth: 1,
        },
        {
          label: 'Función de Densidad de Probabilidad',
          data: pdfValues,
          type: 'line',
          fill: false,
          borderColor: '#FF5733',
          borderWidth: 2,
        },
      ],
    };

    // Configurar las opciones del gráfico
    const chartOptions: ChartOptions = {
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
            text: 'Densidad de Probabilidad',
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Histograma y Función de Densidad de Probabilidad de Distribución de Weibull',
        },
      },
    };

    // Crear el gráfico
    this.chart = new Chart('chart', {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });
  }

  lognormalChart() {
    // Parámetros de la distribución logarítmico normal
    const mean = this.mean;
    const stDev = this.stDev;
    const mu = Math.log(mean ** 2 / Math.sqrt(stDev ** 2 + mean ** 2)); // Media logarítmica corregida
    const sigma = Math.sqrt(Math.log(1 + stDev ** 2 / mean ** 2)); // Desviación estándar logarítmica corregida

    // Función de densidad de probabilidad (PDF) de la distribución logarítmica normal
    function lognormalPDF(x: any) {
      const coefficient = 1 / (x * sigma * Math.sqrt(2 * Math.PI));
      const exponent = -((Math.log(x) - mu) ** 2) / (2 * sigma ** 2);
      return coefficient * Math.exp(exponent);
    }

    // Datos para el gráfico
    const labels = [];
    const data = [];

    // Calcular datos para el gráfico
    const step = 2; // Mostrar cada 2 puntos en el eje x
    for (let x = 1; x <= 200; x += 0.1 * step) {
      const pdf = lognormalPDF(x);
      if (pdf > 0.001) {
        // Filtrar valores cercanos a cero
        labels.push(x.toFixed(2));
        data.push(pdf);
      }
    }

    // Crear gráfico
    this.chart = new Chart('chart', {
      type: 'line', // Cambiar a 'line' para representar correctamente la PDF
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Distribución Logarítmico Normal',
            data: data,
            backgroundColor: 'rgba(140, 100, 177, 0.2)', // Color con transparencia
            borderColor: '#8C64B1',
            borderWidth: 1,
            fill: true, // Relleno bajo la curva
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Valor',
            },
            ticks: {
              stepSize: 20, // Mostrar cada 20 puntos en el eje x
            },
          },
          y: {
            title: {
              display: true,
              text: 'Densidad de probabilidad',
            },
          },
        },
      },
    });
  }

  uniformChart() {
    if (this.min.toString().includes('%')) {
      const valueBase = parseFloat(this.min.replace('%', ''));

      this.min = +valueBase / 100;
    }

    if (this.max.toString().includes('%')) {
      const valueBase = parseFloat(this.max.replace('%', ''));

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

  changeValueLognormal() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.lognormalChart();
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
