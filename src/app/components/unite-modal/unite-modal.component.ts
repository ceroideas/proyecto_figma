import { Component, ElementRef, SimpleChanges, ViewChild } from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import 'chartjs-plugin-dragdata';
/* import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables); */
declare var bootstrap: any;
declare var Chart: any;
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
  selectedEscenary: any = '#';
  renderChartVariable!: any;
  createEscenaryChartVariable!: any;
  constructor() {
    this.years = this.escenarys[0].years;
    this.createModel();
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
    this.createEscenaryChartVariable.destroy();
  }
  addEscenary() {
    this.showForm = !this.showForm;
    this.createEscenaryChart();
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

  renderChart() {
    const years = Object.keys(this.escenarys[0].years[0]);
    const values = years.map((key) => this.escenarys[0].years[0][key]);
    const plugins: any = {
      dragData: {
        round: 1,
        showTooltip: true,
        onDragStart: function (
          e: any,
          datasetIndex: any,
          index: any,
          value: any
        ) {
          /* console.log(e); */
        },
        onDrag: function (e: any, datasetIndex: any, index: any, value: any) {
          e.target.style.cursor = 'grabbing';
          /* console.log(value); */
        },
        onDragEnd: function (
          e: any,
          datasetIndex: any,
          index: any,
          value: any
        ) {
          e.target.style.cursor = 'default';
          console.log(value, datasetIndex, index);
        },
      },
    };

    const option: any = {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: '# of Votes',
            data: values,
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
        plugins: plugins,
      },
    };

    new Chart('chartJSContainer', option);
  }
  onSelectChange() {
    console.log('selectedEscenary cambió a:', this.selectedEscenary);

    if (this.selectedEscenary !== '#') {
      this.renderChart();
    }
  }

  createEscenaryChart() {
    const years = Object.keys(this.escenarys[0].years[0]);
    const values = years.map((key) => 0);
    const plugins: any = {
      dragData: {
        round: 1,
        showTooltip: true,
        onDragStart: function (
          e: any,
          datasetIndex: any,
          index: any,
          value: any
        ) {
          /* console.log(e); */
        },
        onDrag: function (e: any, datasetIndex: any, index: any, value: any) {
          e.target.style.cursor = 'grabbing';
          /* console.log(value); */
        },
        onDragEnd: (e: any, datasetIndex: any, index: any, value: any) => {
          e.target.style.cursor = 'default';
          this.model.years[0][years[index]] = value;
          console.log(this.model);
          console.log(value, datasetIndex, index);
        },
      },
    };

    const option: any = {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: '# of Votes',
            data: values,
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
        plugins: plugins,
      },
    };

    this.createEscenaryChartVariable = new Chart('chartJSContainer', option);
  }
}
