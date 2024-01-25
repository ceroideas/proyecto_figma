import { Component, ElementRef, ViewChild } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables);
declare var bootstrap: any;
interface Escenario {
  name: string;
  years: { [year: string]: string }[];
}
@Component({
  selector: 'app-unite-modal',
  standalone: true,
  imports: [MessageComponent, FormsModule, CommonModule],
  templateUrl: './unite-modal.component.html',
  styleUrl: './unite-modal.component.scss',
})
export class UniteModalComponent {
  @ViewChild('uniteModal') miModal!: ElementRef;
  years: string[] = [];
  escenarys: any[] = [
    { name: 'Escenario 1', years: [{ 2020: '1', 2021: '1' }] },
    { name: 'Escenario 2', years: [{ 2020: '2', 2021: '2' }] },
  ];
  model: Escenario = { name: '', years: [] };
  showForm: boolean = false;

  constructor() {
    this.years = this.escenarys[0].years;
    this.createModel();
    var options = {
      type: 'line',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
        datasets: [
          {
            label: '# of Votes',
            data: [12, 19, 3, 5, 2, 3],
            fill: true,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 25,
          },
          {
            label: '# of Points',
            data: [7, 11, 5, 8, 3, 7],
            fill: true,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 25,
          },
        ],
      },
      options: {
        scales: {
          y: {
            min: 0,
            max: 20,
          },
        },
        onHover: function (e: any) {
          const point = e.chart.getElementsAtEventForMode(
            e,
            'nearest',
            { intersect: true },
            false
          );
          if (point.length) e.native.target.style.cursor = 'grab';
          else e.native.target.style.cursor = 'default';
        },
        plugins: {
          dragData: {
            round: 1,
            showTooltip: true,
            onDragStart: function (
              e: any,
              datasetIndex: any,
              index: any,
              value: any
            ) {
              // console.log(e)
            },
            onDrag: function (
              e: any,
              datasetIndex: any,
              index: any,
              value: any
            ) {
              e.target.style.cursor = 'grabbing';
              // console.log(e, datasetIndex, index, value)
            },
            onDragEnd: function (
              e: any,
              datasetIndex: any,
              index: any,
              value: any
            ) {
              e.target.style.cursor = 'default';
              // console.log(datasetIndex, index, value)
            },
          },
        },
      },
    };

    /* new Chart('ctx', options); */
  }
  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {
      console.log('Modal abierto');
    });

    modal._element.addEventListener('hidden.bs.modal', () => {
      const openButton = document.querySelector('#exampleModalButton');

      // Verifica si el botón existe antes de intentar cerrar el modal
      if (openButton) {
        // Simula un clic en el botón para cerrar el modal
        (openButton as HTMLElement).click();
      }
    });
  }
  submitEscenario(escenarioForm: any) {
    const newEscenary = {
      name: this.model.name,
      years: JSON.parse(JSON.stringify(this.model.years)),
    };

    this.escenarys.push(newEscenary);
    this.showForm = false;

    console.log(this.escenarys);
  }
  addEscenary() {
    this.showForm = !this.showForm;
  }

  createModel() {
    const keys = Object.keys(this.escenarys[0].years[0]);

    const years: any = {};
    keys.forEach((clave: string) => {
      years[clave] = '';
    });
    this.model['years'] = [years];
    console.log(this.model);
  }
}
