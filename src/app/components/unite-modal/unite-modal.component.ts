import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import 'chartjs-plugin-dragdata';
import { HttpClientModule } from '@angular/common/http';
import { ProjectService } from 'src/app/services/project.service';
/* import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables); */
declare var bootstrap: any;
declare var Chart: any;
interface Escenario {
  id: any;
  name: string;
  years: { [year: string]: any }[];
  locked: boolean;
}
@Component({
  selector: 'app-unite-modal',
  standalone: true,
  imports: [MessageComponent, FormsModule, CommonModule, HttpClientModule],
  providers: [ProjectService],
  templateUrl: './unite-modal.component.html',
  styleUrl: './unite-modal.component.scss',
})
export class UniteModalComponent implements OnInit {
  @ViewChild('uniteModal') miModal!: ElementRef;
  years: string[] = [];
  @Input() edit: boolean = false;
  escenarysFromDb: any[] = [];
  escenarys: any[] = [];
  model: Escenario = { id: '', name: '', years: [], locked: false };
  showForm: boolean = false;
  selectedEscenary: any = '#';
  renderChartVariable!: any;
  createEscenaryChartVariable!: any;
  yMax: number = 1000;
  escenario: any = [
    { name: 'Escenario 1', yearFrom: 2020, yearTo: 2024 },
    { name: 'Escenario 2', yearFrom: 2020, yearTo: 2024 },
  ];
  values!: any;
  yearsToSee: any[] = [];
  lockedScenary: boolean = false;
  @Input() nodeId!: any;
  constructor(private projectSvc: ProjectService) {}
  ngOnInit(): void {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['edit']) {
      console.log('change');
      if (!this.edit) {
        this.emptyScenarys();
      }
      if (this.edit) {
        this.editScenarys();
        console.log('changeeee');
      }
      this.createModel();
    }

    if (changes['this.model.locked']) {
      console.log('changeeee');
    }
  }

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {});

    modal._element.addEventListener('hidden.bs.modal', () => {
      this.nodeId = undefined;
      this.edit = false;
      this.selectedEscenary = '#';
      this.escenarys = [];

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
      node_id: this.nodeId,
      name: this.model.name,
      years: JSON.parse(JSON.stringify(this.model.years[0])),
    };

    this.projectSvc.saveScenery(newEscenary).subscribe((res: any) => {
      console.log(res);
      this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
        this.escenarys = res.sceneries;
      });
    });

    this.escenarys.push(newEscenary);
    this.showForm = false;

    console.log(this.escenarys);
    this.createEscenaryChartVariable.destroy();
  }
  addEscenary() {
    if (this.renderChartVariable) this.renderChartVariable.destroy();
    this.selectedEscenary = '#';
    this.model.name = '';
    this.createModel();
    this.showForm = !this.showForm;
    this.createEscenaryChart();
  }

  createModel() {
    const keys = Object.keys(this.escenarys[0].years);

    const years: any = {};
    keys.forEach((clave: string) => {
      years[clave] = 0;
    });

    if (this.escenarys[+this.selectedEscenary]) {
      this.model['years'] = [this.escenarys[+this.selectedEscenary].years];
      console.log(this.escenarys[+this.selectedEscenary].years, 'run');
    } else {
      this.model['years'] = [years];
    }

    console.log(this.model['years'], 'years');
  }

  renderChart() {
    const years = Object.keys(
      JSON.parse(JSON.stringify(this.escenarys[0].years))
    );

    /*     const values = years.map(
      (key) => +this.escenarys[this.selectedEscenary].years[0][key]
    ); */
    const values = Object.values(this.escenarys[this.selectedEscenary].years);
    console.log(this.escenarys[this.selectedEscenary], 'values');
    if (!this.values) {
      this.values = values;
    }

    const plugins: any =
      this.lockedScenary === false
        ? {
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
              onDrag: function (
                e: any,
                datasetIndex: any,
                index: any,
                value: any
              ) {
                e.target.style.cursor = 'grabbing';
                /* console.log(value); */
              },
              onDragEnd: (
                e: any,
                datasetIndex: any,
                index: any,
                value: any
              ) => {
                e.target.style.cursor = 'default';
                this.model.years[0][years[index]] = value;
                console.log({
                  years: this.model.years[0],
                });
                this.projectSvc
                  .updateScenery(this.escenarys[+this.selectedEscenary].id, {
                    years: this.model.years[0],
                  })
                  .subscribe((res: any) => {
                    this.projectSvc
                      .getNode(this.nodeId)
                      .subscribe((res: any) => {
                        this.escenarys = res.sceneries;
                      });
                  });
              },
            },
          }
        : {};

    const option: any = {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: '# of Votes',
            data: this.values,
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
            max: 1000,
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
    const escenary = JSON.parse(
      JSON.stringify(this.escenarys[+this.selectedEscenary])
    );
    years.forEach((clave, index) => {
      escenary.years[clave] = this.values[index].toString();
    });

    this.escenarys[+this.selectedEscenary] = escenary;

    console.log(this.escenarys[+this.selectedEscenary].years, 'sl,dlm');
    this.projectSvc
      .updateScenery(this.escenarys[+this.selectedEscenary].id, {
        years: this.escenarys[+this.selectedEscenary].years,
      })
      .subscribe((res: any) => {
        this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
          this.escenarys = res.sceneries;
        });
      });
    this.renderChartVariable = new Chart('chartJSContainer', option);
  }
  onSelectChange() {
    console.log(this.years);
    if (this.selectedEscenary !== '#') {
      if (this.createEscenaryChartVariable)
        this.createEscenaryChartVariable.destroy();
      if (this.renderChartVariable) {
        this.renderChartVariable.destroy();
      }
      this.model.name = this.escenarys[+this.selectedEscenary].name;
      this.model.years = JSON.parse(
        JSON.stringify([this.escenarys[this.selectedEscenary].years])
      );
      this.values = undefined;

      this.createModel();
      this.renderChart();
    }
  }

  createEscenaryChart() {
    const years = Object.keys(this.escenarys[0].years);

    if (!this.values) this.values = years.map((key) => 0);

    const plugins: any =
      this.model.locked === false
        ? {
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
              onDrag: function (
                e: any,
                datasetIndex: any,
                index: any,
                value: any
              ) {
                e.target.style.cursor = 'grabbing';
                /* console.log(value); */
              },
              onDragEnd: (
                e: any,
                datasetIndex: any,
                index: any,
                value: any
              ) => {
                e.target.style.cursor = 'default';
                this.model.years[0][years[index]] = value;
                console.log(this.model);
                console.log(value, datasetIndex, index);
              },
            },
          }
        : {};

    const option: any = {
      type: 'line',
      data: {
        labels: years,
        datasets: [
          {
            label: '# of Votes',
            data: this.values,
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
            max: 1000,
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
  changeValue(i: number, value: any) {
    this.values[i] = +value;

    this.createEscenaryChartVariable.destroy();
    this.createEscenaryChart();
    console.log(this.escenarys[+this.selectedEscenary].years[0], 'value');
  }
  changeValue2(i: number, value: any) {
    this.values[i] = +value;

    this.renderChartVariable.destroy();
    this.renderChart();
  }
  yearKey(year: any): string {
    return Object.keys(year)[0];
  }

  emptyScenarys() {
    const escenario = this.escenario[0];
    const obj: any = {};
    for (let year = escenario.yearFrom; year <= escenario.yearTo; year++) {
      obj[+year] = '0';
    }
    this.yearsToSee.push(obj);
    for (let i = 0; i < this.escenario.length; i++) {
      const element = this.escenario[i];
      this.escenarys.push({ name: element.name, years: this.yearsToSee });
    }
    this.years = this.escenarys[0].years;
  }

  editScenarys() {
    /*     const escenario = this.escenario[0];
    const obj: any = {};
    for (let year = escenario.yearFrom; year <= escenario.yearTo; year++) {
      obj[+year] = '0';
    }
    this.yearsToSee.push(obj);
    for (let i = 0; i < this.escenario.length; i++) {
      const element = this.escenario[i];
      this.escenarys.push({ name: element.name, years: this.yearsToSee });
    } */
    this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
      this.escenarys = res.sceneries;
      this.years = [this.escenarys[0].years];
      console.log(this.years, this.escenarys[0], 'yearsssssss');
    });
  }
  changeLocked() {
    this.createEscenaryChartVariable.destroy();
    this.createEscenaryChart();
  }

  lockedScenarys() {
    this.renderChartVariable.destroy();
    this.renderChart();
  }
}
