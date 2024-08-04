import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
declare var bootstrap: any;
@Component({
  selector: 'app-shape-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shape-modal.component.html',
  styleUrl: './shape-modal.component.scss',
})
export class ShapeModalComponent {
  @ViewChild('shapeModal') miModal!: ElementRef;
  clickedElement: number = 0;
  shapes: any[] = [
    { name: 'Normal', img: '../../../assets/img/Rectangle-shape.png' },
    { name: 'Uniforme', img: '../../../assets/img/rectangle_uniform.png' },
    {
      name: 'Exponencial',
      img: '../../../assets/img/rectangle_exponential.png',
    },
    {
      name: 'Triangular',
      img: '../../../assets/img/triangular.png',
    },
    {
      name: 'Poisson',
      img: '../../../assets/img/poisson.png',
    },
    {
      name: 'Binominal',
      img: '../../../assets/img/binominal.png',
    },

    {
      name: 'Lognormal',
      img: '../../../assets/img/lognormal.png',
    },
    {
      name: 'Geometric',
      img: '../../../assets/img/geometric.png',
    },

    {
      name: 'Weibull',
      img: '../../../assets/img/weibull.png',
    },

    {
      name: 'Beta',
      img: '../../../assets/img/beta.png',
    },
    {
      name: 'Hypergeometric',
      img: '../../../assets/img/hypergeometric.png',
    },
    {
      name: 'Custom',
      img: '../../../assets/img/custom.png',
    },
  ];

  route: string = 'back';
  constructor() {}

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {
      const shapes: any = this.getItem('shapeData');

      if (shapes !== null) {
        const index = this.shapes.findIndex(
          (shape: any) => shape.name == shapes.__zone_symbol__value.name
        );
        console.log('El valor obtenido del Local Storage es:', index);
        this.clickedElement = index;
      } else {
        console.log(
          'No hay ningún valor almacenado con esa clave en el Local Storage.'
        );
      }
    });

    modal._element.addEventListener('hidden.bs.modal', () => {
      console.log(this.route);
      const openButtonBack = document.querySelector('#exampleModalButton');
      const openButtonNext = document.querySelector(
        '#shapeModalSimulationButton'
      );

      if (this.route === 'back') {
        if (openButtonBack) {
          // Simula un clic en el botón para cerrar el modal
          (openButtonBack as HTMLElement).click();
        }
      } else if (this.route === 'next') {
        this.route = 'back';
        if (openButtonBack) {
          // Simula un clic en el botón para cerrar el modal
          (openButtonBack as HTMLElement).click();
        }
      }
    });
  }

  setClickedElement(index: number) {
    this.clickedElement = index;
  }

  /*   next() {
    this.route = 'next';
      localStorage.setItem(
        'shapetype',
        JSON.stringify(this.shapes[this.clickedElement])
      );
      
  } */

  next() {
    this.route = 'next';
    const formShape = {
      min: 0,
      mean: 0,
      rate: 0,
      stDev: 0,
      max: 0,
      mode: 0,
      lamda: 0,
      trials: 0,
      probability: 0,
      alpha: 0,
      beta: 0,
      form: 0,
      success: 0,
      population: 0,
      scale: 0,
      name: this.shapes[this.clickedElement].name,
      type: 'static',
    };
    localStorage.setItem('shapeData', JSON.stringify(formShape));
  }

  getItem(key: any) {
    return new Promise((resolve) => {
      const value = localStorage.getItem(key);
      resolve(JSON.parse(value || ''));
    });
  }
}
