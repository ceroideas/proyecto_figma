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
  clickedElement: number | null = null;
  shapes: any[] = ['Normal', 'Normal', 'Normal', 'Normal'];
  constructor() {}

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {});

    modal._element.addEventListener('hidden.bs.modal', () => {
      console.log('jbhsjisb');
      const openButton = document.querySelector('#exampleModalButton');

      // Verifica si el botón existe antes de intentar cerrar el modal
      if (openButton) {
        // Simula un clic en el botón para cerrar el modal
        (openButton as HTMLElement).click();
      }
    });
  }

  setClickedElement(index: number) {
    this.clickedElement = index;
  }
}
