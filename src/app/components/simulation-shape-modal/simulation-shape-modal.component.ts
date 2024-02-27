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
  min!: any;
  max!: any;
  stDev!: any;
  type: string = 'static';
  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {
      this.ngZone.run(() => {
        this.shapeType = this.getItem('shapetype');
        const shapeData: any = this.getItem('shapeData');

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

        this.min = shapeData?.__zone_symbol__value.min
          ? shapeData?.__zone_symbol__value.min
          : 0;
        this.max = shapeData?.__zone_symbol__value.max
          ? shapeData?.__zone_symbol__value.max
          : 0;
        this.stDev = shapeData?.__zone_symbol__value.stDev
          ? shapeData?.__zone_symbol__value.stDev
          : 0;
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
    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: '# of Votes',
            data: [0, 10, 19, 10, 0],
            fill: true,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 25, // for improved touch support
            // dragData: false // prohibit dragging this dataset
            // same as returning `false` in the onDragStart callback
            // for this datsets index position
          },
        ],
      },
      options: {
        plugins: {},
        scales: {
          y: {
            // dragData: false // disables datapoint dragging for the entire axis
          },
        },
      },
    });
  }

  uniformChart() {
    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: '# of Votes',
            data: [19, 19, 19, 19, 19],
            fill: true,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 25, // for improved touch support
            // dragData: false // prohibit dragging this dataset
            // same as returning `false` in the onDragStart callback
            // for this datsets index position
          },
        ],
      },
      options: {
        plugins: {},
        scales: {
          y: {
            // dragData: false // disables datapoint dragging for the entire axis
          },
        },
      },
    });
  }

  exponentialChart() {
    this.chart = new Chart('chart', {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: '# of Votes',
            data: [19, 12, 7, 2, 0],
            fill: true,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 25, // for improved touch support
            // dragData: false // prohibit dragging this dataset
            // same as returning `false` in the onDragStart callback
            // for this datsets index position
          },
        ],
      },
      options: {
        plugins: {},
        scales: {
          y: {
            // dragData: false // disables datapoint dragging for the entire axis
          },
        },
      },
    });
  }
}
