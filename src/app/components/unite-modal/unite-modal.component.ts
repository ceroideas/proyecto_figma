import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
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
  imports: [MessageComponent, FormsModule, CommonModule],
  providers: [ProjectService],
  templateUrl: './unite-modal.component.html',
  styleUrl: './unite-modal.component.scss',
})
export class UniteModalComponent implements OnInit {
  @ViewChild('uniteModal') miModal!: ElementRef;
  inputValue: string = '';
  years: string[] = [];
  @Input() edit: boolean = false;
  escenarysFromDb: any[] = [];
  escenarys: any[] = [];
  model: Escenario = { id: '', name: '', years: [], locked: false };
  showForm: boolean = false;
  selectedDynamicYear!: any;
  selectedEscenary: any = '#';
  renderChartVariable!: any;
  createEscenaryChartVariable!: any;
  yMax: number = 100;
  sendOperations: any[] = [];
  currentYear: string = new Date().getFullYear().toString();
  escenario: any = [
    { name: 'Escenario 1', yearFrom: 2020, yearTo: 2024 },
    { name: 'Escenario 2', yearFrom: 2020, yearTo: 2024 },
  ];
  isOneYear: boolean = false;
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
  @Input() percentageGrowthModel!: any;
  percentageGrowth!: any;
  percentageGrowthCopy!: any;
  nodeData!: any;
  loading: boolean = false;
  @Input() defaultYear: number = 0;
  bootstrapModal: any;
  closeModal: boolean = false;
  showMenuOperation: boolean = false;
  closeToogle: boolean = false;
  closeToogleCustom: boolean = false;
  variables: any[] = [];
  calculos: any[] = [];
  operations: any[] = [];
  clikedToggle: boolean = false;
  operators: any = [
    '+',
    '-',
    '*',
    '/',
    '=',
    '(',
    ')',
    '?',
    ':',
    '==',
    '!=',
    '>',
    '>=',
    '<',
    '<=',
    '&',
    '|',
  ];
  operators_icon: any[] = [
    { operator: '+', img: '../../../assets/icons/plus_icon.svg' },
    { operator: '-', img: '../../../assets/icons/minus_icon.svg' },
    { operator: '*', img: '../../../assets/icons/asterisk_icon.svg' },
    { operator: '/', img: '../../../assets/icons/lucide_slash.svg' },
    { operator: '=', img: '../../../assets/icons/igual.svg' },
    { operator: '(', img: '../../../assets/icons/tabler_parentheses.svg' },
    { operator: ')', img: '../../../assets/icons/tabler_parentheses2.svg' },
    { operator: '?', img: '../../../assets/icons/f7_question.svg' },
    { operator: ':', img: '../../../assets/icons/two_points_icon.svg' },
    { operator: '==', img: '' },
    { operator: '!=', img: '' },
    { operator: '>', img: '../../../assets/icons/fi_chevron-right.svg' },
    { operator: '<', img: '../../../assets/icons/fi_chevron-left2.svg' },
    { operator: '>=', img: '' },
    { operator: '<=', img: '' },
    { operator: '&', img: '../../../assets/icons/tabler_ampersand.svg' },
    { operator: '|', img: '../../../assets/icons/fi_more-vertical2.svg' },
    { operator: '^', img: '' },
  ];
  mostrarPopover: boolean = false;
  @Input() editVariable: boolean = false;
  @ViewChild('popover') popover!: ElementRef;
  @ViewChild('popoverMenu') popoverMenu!: ElementRef;
  selectedCalculo: any;
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

  nodeInCalculo(id: any) {
    const find = this.calculos.find((calculo: any) => calculo.id == id);
    if (find) {
      return true;
    } else {
      return false;
    }
  }

  addCalculo(operation: any) {
    this.calculos.push({
      name: operation.operator,
      img: operation.img,
      operator: true,
      id: operation.operator,
    });
    this.operations.push([{ name: operation.operator }]);

    this.sendOperations.push(operation.operator);

    console.log(this.calculos, this.sendOperations, 'PARA');
  }

  addVariable(variable: any, id: any) {
    if (
      this.operators.includes(this.calculos[this.calculos.length - 1]?.name)
    ) {
      // if (variable.type === 2) {
      //   [variable.calculated].forEach((e: any) => {
      //     e.operation = this.calculos[this.calculos.length - 1]?.name;
      //   });
      // } else {
      //   [variable.sceneries].forEach((e: any) => {
      //     e.operation = this.calculos[this.calculos.length - 1]?.name;
      //   });
      // }
    }

    variable.isActive = true;

    this.calculos.push({ name: variable.name, operator: false, id: id });
    const variableTo =
      variable.type === 2 ? variable.calculated : variable.sceneries;
    this.operations.push(variableTo);

    this.calculos[this.calculos.length - 1];

    /*  this.operationResult(); */
    this.sendOperations.push(id);
    const selectedEscenary = this.escenarys[+this.selectedEscenary];
    this.escenarys[+this.selectedEscenary].dynamic_years.forEach((esc: any) => {
      console.log(esc.year, this.selectedDynamicYear, 'AQUI');
      if (esc.year == this.selectedDynamicYear) {
        esc.formula = [
          {
            formula: [...this.sendOperations],
            showFormula: [...this.calculos],
          },
        ];
      }
    });
    console.log(selectedEscenary, 'OHHHHH');
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    this.clikedToggle = !this.clikedToggle;
    const clickedInside = this.popover?.nativeElement.contains(event.target);
    const clickedInsideMenu = this.popoverMenu?.nativeElement.contains(
      event.target
    );
    if (!clickedInside && !this.clikedToggle) {
      this.cerrarPopoverCustom(event);
      console.log('Cierro');
    }

    if (!clickedInsideMenu) {
      this.cerrarPopover(event);
    }
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
    console.log(selectedEscenary, { years: this.model.years[0] }, 'NECESARY?');

    if (
      selectedEscenary &&
      selectedEscenary.id != undefined &&
      !this.showForm
    ) {
      this.projectSvc
        .updateScenery(selectedEscenary.id, {
          years: selectedEscenary.years,
          dynamic_years: selectedEscenary.dynamic_years,
        })
        .subscribe(() => {
          this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
            this.updateNodeGrowthPercentage();
            this.escenarys = res.sceneries;
            this.closeModal = true;
            this.bootstrapModal.hide();
            this.resetVariables();

            this.showForm = false;
            this.model.locked = false;
            this.handleSelectedEscenary();

            this.clickOpenButton();
          });
          this.printAllEvent.emit();
        });
    } else {
      this.closeModal = true;
      this.updateNodeGrowthPercentage();
      this.bootstrapModal.hide();
      this.resetVariables();

      this.showForm = false;
      this.model.locked = false;
      this.handleSelectedEscenary();

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
  togglePopover(year: any) {
    if (+year <= this.defaultYear) {
      return;
    }

    this.selectedDynamicYear = year;
    this.showMenuOperation = !this.showMenuOperation;

    console.log(this.escenarys[+this.selectedEscenary], 'ASALTIAAA');
    this.escenarys[+this.selectedEscenary].dynamic_years.forEach((esc: any) => {
      if (esc.year == year && esc.formula[0]) {
        this.sendOperations = esc.formula[0].formula ?? [];
        this.calculos = esc.formula[0].showFormula ?? [];
      }
      if (esc.year == year && esc.formula.length <= 0) {
        this.calculos = [];
        this.sendOperations = [];
      }
    });

    if (year - 1 != this.defaultYear) {
      if (this.variables[3]) {
        this.variables[3] = {
          name: `${'node ' + (year - 1) + ' value'}`,
          id: 4,
        };
      } else {
        this.variables.push({
          name: `${'node ' + (year - 1) + ' value'}`,
          id: 4,
        });
      }
    } else if (this.variables[3]) {
      this.variables.pop();
    }

    setTimeout(() => {
      this.closeToogle = this.showMenuOperation;
    }, 100);
  }

  togglePopoverCustom() {
    this.mostrarPopover = !this.mostrarPopover;
    setTimeout(() => {
      this.closeToogleCustom = this.mostrarPopover;
    }, 100);
  }

  addCustom() {
    if (this.inputValue === '') {
      return;
    }
    if (this.inputValue.toString().includes('%')) {
      const valueBase = parseFloat(this.inputValue.toString().replace('%', ''));

      this.inputValue = (+valueBase / 100).toString();
    }

    this.calculos.push({
      name: this.inputValue,
      operator: false,
      id: `${this.inputValue}`,
    });
    this.operations.push([{ name: this.inputValue }]);

    this.sendOperations.push(this.inputValue);

    console.log(this.calculos, this.sendOperations, 'PARA');

    this.inputValue = '';
    this.mostrarPopover = false;
    this.closeToogleCustom = false;
    setTimeout(() => {
      this.showMenuOperation = !this.showMenuOperation;
      this.closeToogle = this.showMenuOperation;
    }, 100);

    // this.cerrarPopoverCustom();
  }

  cerrarPopover(event: MouseEvent) {
    if (this.closeToogle) {
      this.showMenuOperation = false;
      this.closeToogle = false;
    }

    // if (!this.showMenuOperation) {
    //   this.sendOperations = [];
    //   this.calculos = [];
    // }
  }

  cerrarPopoverCustom(event?: MouseEvent) {
    if (this.closeToogleCustom) {
      this.mostrarPopover = false;
      this.closeToogleCustom = false;
    }
  }

  seleccionarCalculo(calculo: any): void {
    this.selectedCalculo = calculo;
  }

  deseleccionarCalculo(): void {
    this.selectedCalculo = null;
  }
  eliminatedOperation(i: any) {
    this.calculos.splice(i, 1);

    this.operations.splice(i, 1);
    this.sendOperations.splice(i, 1);

    setTimeout(() => {
      this.showMenuOperation = true;
      this.closeToogle = true;
    }, 0);
  }
  updateNodeGrowthPercentage() {
    this.percentageGrowth = this.percentageGrowthCopy ?? this.percentageGrowth;
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
    const values = Object.values(this.escenarys[this.selectedEscenary].years);

    if (!this.values) {
      this.values = values;
    }
    if (!this.isOneYear) {
      this.isOneYear = this.values.length == 1 ? true : false;
    }
    if (this.isOneYear) {
      const value = this.values[0];
      this.values = [value, value];
      years.push(years[0]);
    }
    console.log(this.values, years);

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
                console.log(this.model, this.escenarys, this.selectedEscenary);
                if (this.isOneYear) {
                  this.renderChartVariable.destroy();
                  this.renderChart();
                }
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
            tension: this.values.length > 1 ? 0.4 : 0, // No curve for a single point
            borderWidth: this.values.length > 1 ? 1 : 0, // Hide border for a single point
            borderColor: this.values.length > 1 ? '#36a2eb' : 'transparent', // Hide border if one point
            pointRadius: this.values.length === 1 ? 10 : 5, // Bigger point if only one
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

    this.renderChartVariable = new Chart('chartJSContainer', option);
    this.calcularMontoConIncremento();
  }

  onSelectChange() {
    if (this.oldEscenarieId && this.oldEscenarieId !== '#') {
      console.log('OLD');
      this.projectSvc
        .updateScenery(this.oldEscenarieId, {
          years: this.model.years[0],
          dynamic_year: this.escenarys[+this.selectedEscenary].dynamic_year,
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

      this.variables = [
        { name: `${'Default growth node'}`, id: 1 },
        { name: 'Default growth model', id: 2 },
        {
          name: 'Default year value',
          values: this.years[0][this.defaultYear],
          id: 3,
        },
      ];

      console.log(this.variables, 'PARA PENSAR');
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
        dynamic_year: this.escenarys[+this.selectedEscenary].dynamic_year,
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
    this.percentageGrowthCopy = this.percentageGrowth;
    console.log(this.percentageGrowthCopy);
  }
}
