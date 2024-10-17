import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { MessageComponent } from '../message/message.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import 'chartjs-plugin-dragdata';
import { HttpClientModule } from '@angular/common/http';
import { ProjectService } from 'src/app/services/project.service';
import { DataService } from 'src/app/services/data-service.service';
import { EventsService } from 'src/app/services/events.service';

declare var bootstrap: any;
declare var Chart: any;
interface Escenario {
  id: any;
  name: string;
  years: { [year: string]: string }[];
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
  yMax: number = 100;
  currentYear: string = new Date().getFullYear().toString();
  escenario: any = [
    { name: 'Escenario 1', yearFrom: 2020, yearTo: 2024 },
    { name: 'Escenario 2', yearFrom: 2020, yearTo: 2024 },
  ];
  @Output() sendEsceneriesEvent = new EventEmitter<any>();
  @Output() printAllEvent = new EventEmitter<any>();
  values!: any;
  @Input() cleanEsceneries: any[] = [];
  yearsToSee: any[] = [];
  @Input() lockedScenary: boolean = false;
  @Input() nodeId!: any;
  deleteEsceneries: boolean = false;
  oldEscenarieId!: any;
  unite!: any;
  nodeName!: string;
  percentageGrowth!: any;
  nodeData!: any;
  loading: boolean = false;
  @Input() defaultYear: number = 0;
  bootstrapModal: any;
  closeModal: boolean = false;
  constructor(
    private projectSvc: ProjectService,
    private dataService: DataService,

    public events: EventsService
  ) {}
  ngOnInit(): void {
    this.dataService.data$.subscribe((data) => {
      this.deleteEsceneries = data;
    });

    this.events.destroy('changeEditUnite');
    this.events.subscribe('changeEditUnite', (a) => {
      this.unite = a;
      if (this.edit) {
        this.projectSvc
          .saveUnite(this.nodeId, { unite: a })
          .subscribe((data) => {});
      }
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cleanEsceneries']) {
      this.editScenarys();
    }
    if (changes['edit']) {
      if (!this.edit) {
        /* this.emptyScenarys(); */

        this.editScenarys();
      }
      if (this.edit) {
        this.editScenarys();
      }
      this.createModel();
    }
    if (changes['selectedEscenary']) {
    }
  }

  ngAfterViewInit() {
    this.bootstrapModal = new bootstrap.Modal(this.miModal.nativeElement);

    this.bootstrapModal._element.addEventListener('shown.bs.modal', () => {
      setTimeout(() => {
        var evt = new Event('change');
        var elem = document.getElementById(
          'escenarios-select'
        ) as HTMLSelectElement;
        elem.selectedIndex = 1;
        elem.dispatchEvent(evt);
      }, 1000);
    });

    this.bootstrapModal._element.addEventListener(
      'hide.bs.modal',
      (event: any) => {
        if (!this.closeModal) {
          event.preventDefault();
          this.loading = true;
          this.updateSceneryIfRequired();
        } else {
          this.closeModal = false;
          this.loading = false;
        }
      }
    );
  }

  /*   ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {});

    modal._element.addEventListener('hidden.bs.modal', () => {
      console.log(
        'years',
        this.escenarys[+this.selectedEscenary].id,
        this.model.years[0]
      );
      this.oldEscenarieId = undefined;
      if (this.createEscenaryChartVariable)
        this.createEscenaryChartVariable.destroy();
      if (this.renderChartVariable) this.renderChartVariable.destroy();
      if (
        this.escenarys[+this.selectedEscenary].id != undefined &&
        !this.showForm
      ) {
        this.projectSvc
          .updateScenery(this.escenarys[+this.selectedEscenary].id, {
            years: this.model.years[0],
          })
          .subscribe((res: any) => {
            this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
              this.escenarys = res.sceneries;
            });

            this.printAllEvent.emit();
          });
      }
      this.showForm = false;
      this.model.locked = false;
      if (this.renderChartVariable) this.renderChartVariable.destroy();
      if (!this.edit) {
        this.sendEsceneries();
        this.selectedEscenary = '#';
      } else {
        this.selectedEscenary = '#';
      }

      const openButton = document.querySelector('#exampleModalButton');

      if (openButton) {
        (openButton as HTMLElement).click();
      }

      this.projectSvc
        .updateNode(this.nodeId, {
          default_growth_percentage: this.percentageGrowth,
        })
        .subscribe((res: any) => {});
    });
  }
 */
  resetVariables() {
    this.oldEscenarieId = undefined;
    this.destroyChartVariables();
  }

  destroyChartVariables() {
    if (this.createEscenaryChartVariable) {
      this.createEscenaryChartVariable.destroy();
    }
    if (this.renderChartVariable) {
      this.renderChartVariable.destroy();
    }
  }

  updateSceneryIfRequired() {
    const selectedEscenary = this.escenarys[+this.selectedEscenary];
    console.log(selectedEscenary, { years: this.model.years[0] });

    if (
      selectedEscenary &&
      selectedEscenary.id != undefined &&
      !this.showForm
    ) {
      this.projectSvc
        .updateScenery(selectedEscenary.id, { years: selectedEscenary.years })
        .subscribe(() => {
          this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
            this.escenarys = res.sceneries;
            this.closeModal = true;
            this.bootstrapModal.hide();
            this.resetVariables();

            this.showForm = false;
            this.model.locked = false;
            this.handleSelectedEscenary();
            this.updateNodeGrowthPercentage();
            this.clickOpenButton();
          });
          this.printAllEvent.emit();
        });
    } else {
      this.closeModal = true;
      this.bootstrapModal.hide();
      this.resetVariables();

      this.showForm = false;
      this.model.locked = false;
      this.handleSelectedEscenary();
      this.updateNodeGrowthPercentage();
      this.clickOpenButton();
    }
  }

  handleSelectedEscenary() {
    if (!this.edit) {
      this.sendEsceneries();
    }
    this.selectedEscenary = '#';
  }

  clickOpenButton() {
    const openButton = document.querySelector('#exampleModalButton');
    if (openButton) {
      (openButton as HTMLElement).click();
    }
  }

  updateNodeGrowthPercentage() {
    this.projectSvc
      .updateNode(this.nodeId, {
        default_growth_percentage: this.percentageGrowth,
      })
      .subscribe();
  }

  submitEscenario(escenarioForm: any) {
    const newEscenary = {
      node_id: this.nodeId,
      name: this.model.name,
      years: JSON.parse(JSON.stringify(this.model.years[0])),
      status: this.model.locked === true ? 0 : 1,
    };

    this.projectSvc.saveScenery(newEscenary).subscribe((res: any) => {
      this.printAllEvent.emit();
      if (this.edit) {
        this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
          this.escenarys = res.sceneries;
        });
      }
    });

    this.escenarys.push(newEscenary);
    this.showForm = false;

    this.createEscenaryChartVariable.destroy();
  }
  addEscenary() {
    this.showForm = !this.showForm;
    this.model.locked = false;
    if (this.showForm) {
      if (this.renderChartVariable) this.renderChartVariable.destroy();
      this.values = undefined;
      this.escenarys = this.cleanEsceneries;
      this.years = [this.escenarys[0]?.years];
      this.selectedEscenary = '#';
      this.oldEscenarieId = undefined;
      this.model.name = '';
      this.createModel();

      this.createEscenaryChart();
    } else {
      this.editScenarys();
    }
  }

  createModel() {
    const keys = Object.keys(this.escenarys[0]?.years);

    const years: any = {};
    keys.forEach((clave: string) => {
      years[clave] = this.unite ? this.unite : 0;
    });

    if (this.escenarys[+this.selectedEscenary]) {
      this.model['years'] = [this.escenarys[+this.selectedEscenary].years];
      this.model['locked'] =
        this.escenarys[+this.selectedEscenary].status === 0 ? true : false;
    } else {
      this.model['years'] = [years];
    }
  }

  renderChart() {
    const years = Object.keys(
      JSON.parse(JSON.stringify(this.escenarys[0]?.years))
    );

    /*     const values = years.map(
      (key) => +this.escenarys[this.selectedEscenary].years[0][key]
    ); */

    const values = Object.values(this.escenarys[this.selectedEscenary].years);
    console.log(values, 'UNITE VALUES');

    if (!this.values) {
      this.values = values;
    }

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
                /* //console.log(e); */
              },
              onDrag: (e: any, datasetIndex: any, index: any, value: any) => {
                e.target.style.cursor = 'grabbing';

                this.renderChartVariable.options.scales.y.max =
                  this.calcularMontoConIncremento() < 100
                    ? 100
                    : this.calcularMontoConIncremento();
              },
              onDragEnd: (
                e: any,
                datasetIndex: any,
                index: any,
                value: any
              ) => {
                e.target.style.cursor = 'default';
                this.model.years[0][years[index]] = value;
                this.escenarys[this.selectedEscenary].years =
                  this.model.years[0];
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
            label: '#',
            data: this.values,
            fill: true,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 25,
          },
        ],
      },
      options: {
        animation: false,
        scales: {
          y: {
            min: 0,
            max:
              this.calcularMontoConIncremento() === 0
                ? 100
                : this.calcularMontoConIncremento(),
            ticks: {
              callback: function (value: any) {
                return value.toLocaleString('de-DE'); // Formatear valores con separadores de miles
              },
            },
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

    /*     if (this.edit) {
      this.projectSvc
        .updateScenery(this.escenarys[+this.selectedEscenary].id, {
          years: this.escenarys[+this.selectedEscenary].years,
        })
        .subscribe((res: any) => {
          this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
            this.escenarys = res.sceneries;
          });
          this.printAllEvent.emit();
        });
    } */

    this.renderChartVariable = new Chart('chartJSContainer', option);
    this.calcularMontoConIncremento();
  }
  onSelectChange() {
    if (this.oldEscenarieId && this.oldEscenarieId !== '#') {
      console.log('OLD');
      this.projectSvc
        .updateScenery(this.oldEscenarieId, {
          years: this.model.years[0],
        })
        .subscribe((res: any) => {
          this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
            this.escenarys = res.sceneries;
          });

          this.printAllEvent.emit();
        });
    }

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
      this.calcularMontoConIncremento();
      this.oldEscenarieId = this.escenarys[+this.selectedEscenary].id;
    }
  }

  createEscenaryChart() {
    const years = Object.keys(this.escenarys[0]?.years);

    if (!this.values)
      this.values = years.map((key) => (this.unite ? this.unite : 0));

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
              ) {},
              onDrag: (e: any, datasetIndex: any, index: any, value: any) => {
                e.target.style.cursor = 'grabbing';

                this.createEscenaryChartVariable.options.scales.y.max =
                  this.calcularMontoConIncremento() < 100
                    ? 100
                    : this.calcularMontoConIncremento();
              },
              onDragEnd: (
                e: any,
                datasetIndex: any,
                index: any,
                value: any
              ) => {
                e.target.style.cursor = 'default';
                this.model.years[0][years[index]] = value;
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
            label: '#',
            data: this.values,
            fill: true,
            tension: 0.4,
            borderWidth: 1,
            pointHitRadius: 25,
          },
        ],
      },
      options: {
        animation: false,
        scales: {
          y: {
            min: 0,
            max:
              this.calcularMontoConIncremento() === 0
                ? 100
                : this.calcularMontoConIncremento(),
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
  }
  changeValue2(i: number, value: any, inputId: any) {
    if (value.includes('%')) {
      const valueBase = parseFloat(value.replace('%', ''));

      this.values[i] = +valueBase / 100;

      setTimeout(() => {
        this.model.years[0][inputId.toString()] = (+valueBase / 100).toString();
      }, 250);
    } else {
      this.values[i] = +value;
    }

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
    this.years = this.escenarys[0]?.years;
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

    if (this.edit) {
      this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
        this.nodeName = res.name;
        this.escenarys = res.sceneries;
        this.unite = res.unite;
        this.years = [this.escenarys[0]?.years];
        this.nodeData = res;
        this.percentageGrowth = res.default_growth_percentage;
      });
    } else {
      this.escenarys = this.cleanEsceneries;
      this.years = [this.escenarys[0]?.years];
    }
  }
  changeLocked() {
    console.log('lock');
    this.projectSvc
      .updateScenery(this.escenarys[+this.selectedEscenary].id, {
        years: this.model.years[0],
        status: this.model.locked ? 0 : 1,
      })
      .subscribe((res: any) => {});
    if (this.renderChartVariable) {
      this.renderChartVariable.destroy();
      this.renderChart();
    }
    if (this.createEscenaryChartVariable) {
      this.createEscenaryChartVariable.destroy();
      this.createEscenaryChart();
    }
  }

  lockedScenarys() {
    this.renderChartVariable.destroy();
    this.renderChart();
  }

  sendEsceneries() {
    this.sendEsceneriesEvent.emit(this.escenarys);
  }

  trackByFn(index: any, item: any) {
    return index;
  }

  calcularMontoConIncremento() {
    if (this.values) {
      const cantidadesNumeros: number[] = this.values.map((cantidad: any) =>
        typeof cantidad === 'string'
          ? parseFloat(cantidad)
          : (cantidad as number)
      );

      const cantidadMaxima: number | undefined = Math.max(...cantidadesNumeros);

      if (cantidadMaxima !== undefined) {
        const incremento: number = cantidadMaxima * 0.2;

        const resultado: number = cantidadMaxima + incremento;
        this.yMax = resultado;
        if (this.renderChartVariable) {
          this.renderChartVariable.options.scales.y.max =
            this.yMax === 0 ? 100 : this.yMax;
        }

        if (this.createEscenaryChartVariable) {
          this.createEscenaryChartVariable.options.scales.y.max = 100;
        }

        return resultado;
      } else {
        throw new Error('No hay cantidades válidas para calcular.');
      }
    } else {
      return 100;
    }
  }
  onKeyDown(event: KeyboardEvent): void {
    const allowedChars = /[0-9%.]/;

    if (!allowedChars.test(event.key) && event.key !== 'Backspace') {
      event.preventDefault();
    }
  }

  formatMonto(monto: any): string {
    return Number(monto).toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 3,
    });
  }

  applyGrowth() {
    let decimalPercentage = parseFloat(this.percentageGrowth) / 100;

    let years: any = this.model.years[0];

    let defaultValue = parseFloat(years[this.defaultYear]);

    for (let year in years) {
      if (parseInt(year) > this.defaultYear) {
        years[year] = defaultValue * (1 + decimalPercentage);
        defaultValue = parseFloat(years[year]);
      }
    }
    const values = Object.values(years);

    this.values = values;
    this.renderChartVariable.destroy();
    this.renderChart();
  }

  onInput(event: Event) {
    const input = event.target as HTMLInputElement;
    let value = parseFloat(input.value);

    if (isNaN(value)) {
      this.percentageGrowth = 0;
    }
  }
}
