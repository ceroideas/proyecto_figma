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
  ];

  route: string = 'back';
  constructor() {}

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {});

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
        if (openButtonNext) {
          // Simula un clic en el botón para cerrar el modal
          (openButtonNext as HTMLElement).click();
        }
      }
    });
  }

  setClickedElement(index: number) {
    this.clickedElement = index;
  }

  next() {
    this.route = 'next';
    localStorage.setItem(
      'shapetype',
      JSON.stringify(this.shapes[this.clickedElement])
    );
  }
}
