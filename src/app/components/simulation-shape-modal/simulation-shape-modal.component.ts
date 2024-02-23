import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
declare var bootstrap: any;
@Component({
  selector: 'app-simulation-shape-modal',
  standalone: true,
  imports: [CommonModule],
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
  shapeType!: any;
  constructor() {}

  ngOnInit(): void {
    const data = this.generateNormalDistribution(50, 10, 100);
    new Chart('chart', {
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

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {
      this.shapeType = this.getItem('shapetype');
      console.log(this.shapeType, 'shapeType');
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

  generateNormalDistribution(mean: any, stdDev: any, size: any) {
    const data = [];
    for (let i = 0; i < size; i++) {
      const value = this.gaussianRandom(mean, stdDev);
      data.push(value);
    }
    return data;
  }

  gaussianRandom(mean: any, stdDev: any) {
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    return mean + stdDev * z;
  }

  save() {
    this.route = 'save';
  }

  getItem(key: string): any {
    const storedItem = localStorage.getItem(key);
    console.log(storedItem);
    return storedItem ? JSON.parse(storedItem) : null;
  }
}
