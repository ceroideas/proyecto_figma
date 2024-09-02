import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
  HostListener,
  Renderer2,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import {
  Chart,
  ChartData,
  ChartOptions,
  registerables,
} from 'node_modules/chart.js';
import { DataService } from 'src/app/services/data-service.service';
import { ProjectService } from 'src/app/services/project.service';
import { EventsService } from 'src/app/services/events.service';
import Swal from 'sweetalert2';
import { firstValueFrom } from 'rxjs';
Chart.register(...registerables);
declare var bootstrap: any;
@Component({
  selector: 'app-edit-variable',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [ProjectService],
  templateUrl: './edit-variable.component.html',
  styleUrl: './edit-variable.component.scss',
})
export class EditVariableComponent implements OnInit, OnChanges {
  @Input() variableId: any;
  @Input() scenerieId: any;
  @Input() variableFather: any;
  @Input() editVariable: boolean = false;
  @Input() aux: any;
  @Input() tier: any;
  @ViewChild('editableContent', { static: true }) editableContent!: ElementRef;
  @ViewChild('editableConstante', { static: true })
  editableConstante!: ElementRef;
  @ViewChild('exampleModal') miModal!: ElementRef;
  editVariableName: boolean = false;
  editVariableDescription: boolean = false;
  editVariableUnidad: boolean = false;
  variableOperation: any;
  mean: number = 0;
  rate: any = 0;
  min: any = 0;
  max: any = 0;
  stDev: number = 0;
  variableSelect1: any = '#';
  variableSelect2: any = '#';
  variableUnidad!: any;
  isOperation: boolean = false;
  constante: boolean = true;
  variableName!: any;
  @Input() isHidden: boolean = false;
  variableDescription!: any;
  operationType: any = '+';
  closeToogle: boolean = false;
  @Input() defaultYear!: number;
  isConstante: boolean = true;
  private cursorPosition: number = 0;
  tempObject = [
    {},
    {
      name: this.variableName,
      description: this.variableDescription,
      constante: this.constante,
      operation: false,
    },
  ];
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
  ];

  scenarioId!: any;
  scenarioId2!: any;

  @Input() isNewTree: boolean = false;
  calculos: any[] = [];
  disableSend: boolean = true;
  onlyConst: any = [];
  @Input() nodeId!: any;
  @Input() projectId!: any;
  variables: any[] = [];
  cargando: boolean = false;
  simbols: any[] = [
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
  shapeData: any = {
    __zone_symbol__value: { name: 'Normal' },
  };
  showNewEscenario: any[] = [];
  operations: any[] = [];
  sendOperations: any[] = [];
  selectedCalculo: any;
  chart!: any;
  mostrarPopover: boolean = false;
  inputValue: string = '';
  oldType!: boolean;
  @Output() sendDataEvent = new EventEmitter<any>();

  @ViewChild('popover') popover!: ElementRef;

  @Output() deleteDataEvent = new EventEmitter<any>();
  @Output() deleteNode = new EventEmitter<any>();
  @Output() editDataEvent = new EventEmitter<any>();
  @Output() hiddenDataEvent = new EventEmitter<any>();
  mode: number = 0;
  lamda: number = 0;
  trials: number = 0;
  probability: number = 0;
  scale: number = 0;
  form: number = 0;
  alpha: number = 0;
  beta: number = 0;
  success: number = 0;
  population: number = 0;
  private escKeyPressed = false;
  scenarioYears!: any;
  constructor(
    private projectSvc: ProjectService,
    private dataService: DataService,
    private ngZone: NgZone,
    public events: EventsService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editVariable']) {
      this.updateVariables();
    }

    if (changes.hasOwnProperty('isHidden')) {
      const hidden = changes['isHidden'].currentValue;
      if (hidden) {
        this.hiddenData();
      }
      this.isHidden = false;
    }
  }

  ngOnInit(): void {
    const modalElement = document.getElementById('exampleModal');

    if (modalElement) {
      this.renderer.listen(modalElement, 'hidden.bs.modal', () => {
        if (this.escKeyPressed) {
          this.deleteShapeData();
          this.escKeyPressed = false; // Reset the flag
        } else {
          console.log('Modal closed by another action');
        }
      });
      this.renderer.listen(modalElement, 'shown.bs.modal', () => {
        if (this.editVariable && this.scenarioId) {
          this.cargando = true;

          this.projectSvc.getScenery(this.scenarioId).subscribe((res: any) => {
            this.scenarioYears = res.years;
            this.variableUnidad = res.years[this.defaultYear];
            this.cargando = false;
          });
        }
      });

      // Listen for keydown event on the document
      this.renderer.listen('document', 'keydown', (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          this.escKeyPressed = true;
        }
      });
    }

    this.deleteShapeData();
    this.projectSvc.getProject(this.projectId).subscribe((res: any) => {
      this.variables = res.node;
    });

    if (this.editVariable) {
      let variable = this.tempObject[this.variableId];
      this.variableName = variable?.name;
      this.variableDescription = variable?.description;
    } else {
    }
  }

  togglePopover() {
    this.mostrarPopover = !this.mostrarPopover;
    setTimeout(() => {
      this.closeToogle = this.mostrarPopover;
    }, 100);
  }

  guardar() {
    this.mostrarPopover = false;
  }

  cerrarPopover(event: MouseEvent) {
    if (this.closeToogle) {
      this.mostrarPopover = false;
      this.closeToogle = false;
    }
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const clickedInside = this.popover?.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.cerrarPopover(event);
    }
  }

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', async () => {
      this.ngZone.run(() => {
        try {
          this.shapeData = this.getItem('shapeData');

          this.min = this.shapeData.__zone_symbol__value.min
            ? this.shapeData.__zone_symbol__value.min
            : this.min;

          this.max = this.shapeData.__zone_symbol__value.max
            ? this.shapeData.__zone_symbol__value.max
            : this.max;

          this.stDev = this.shapeData.__zone_symbol__value.stDev
            ? this.shapeData.__zone_symbol__value.stDev
            : this.stDev;

          this.rate = this.shapeData.__zone_symbol__value.rate
            ? this.shapeData.__zone_symbol__value.rate
            : this.rate;

          this.mean = this.shapeData.__zone_symbol__value.mean
            ? this.shapeData.__zone_symbol__value.mean
            : this.mean;

          this.mode = this.shapeData.__zone_symbol__value.mode
            ? this.shapeData.__zone_symbol__value.mode
            : this.mode;

          this.lamda = this.shapeData.__zone_symbol__value.lamda
            ? this.shapeData.__zone_symbol__value.lamda
            : this.lamda;

          this.trials = this.shapeData.__zone_symbol__value.trials
            ? this.shapeData.__zone_symbol__value.trials
            : this.trials;

          this.probability = this.shapeData.__zone_symbol__value.probability
            ? this.shapeData.__zone_symbol__value.probability
            : this.probability;

          this.scale = this.shapeData.__zone_symbol__value.scale
            ? this.shapeData.__zone_symbol__value.scale
            : this.scale;

          this.form = this.shapeData.__zone_symbol__value.form
            ? this.shapeData.__zone_symbol__value.form
            : this.form;

          this.alpha = this.shapeData.__zone_symbol__value.alpha
            ? this.shapeData.__zone_symbol__value.alpha
            : this.alpha;

          this.beta = this.shapeData.__zone_symbol__value.beta
            ? this.shapeData.__zone_symbol__value.beta
            : this.beta;

          this.success = this.shapeData.__zone_symbol__value.success
            ? this.shapeData.__zone_symbol__value.success
            : this.success;

          this.population = this.shapeData.__zone_symbol__value.population
            ? this.shapeData.__zone_symbol__value.population
            : this.population;

          const chartName = this.shapeData.__zone_symbol__value.name;

          if (this.chart) {
            this.chart.destroy();
          }

          switch (chartName) {
            case 'Normal':
              this.normalChart();
              break;
            case 'SyntaxError':
              this.normalChart();
              break;
            case 'Uniforme':
              this.uniformChart();
              break;
            case 'Exponencial':
              this.exponentialChart();
              break;
            case 'Triangular':
              this.triangularChart();
              break;
            case 'Poisson':
              this.poissonChart();
              break;
            case 'Binominal':
              this.binomialChart();
              break;
            case 'Geometric':
              this.geometricChart();
              break;
            case 'Weibull':
              this.weibullChart();
              break;
            case 'Beta':
              this.betaChart();
              break;
            case 'Hypergeometric':
              this.hypergeometricChart();
              break;
            case 'Lognormal':
              this.lognormalChart();
              break;
            default:
              console.error(`Tipo de gráfico no reconocido: ${chartName}`);
          }
        } catch (error) {
          console.error("Error al obtener o procesar 'shapeData':", error);
        }
      });
      if (!this.nodeId) {
        this.updateVariables();
      }
      this.projectSvc.getProject(this.projectId).subscribe((res: any) => {
        this.variables = res.nodes;
      });
    });

    modal._element.addEventListener('hidden.bs.modal', () => {
      /*       if (!this.editVariable) {
        this.variableSelect1 = '';
        this.variableSelect2 = '';
        this.variableName = '';
        this.variableDescription = '';
        this.variableUnidad = undefined;
        this.editVariableName = false;
        this.editVariableDescription = false;
        this.editVariableUnidad = false;
        this.isOperation = false;
        this.constante = true;
        this.calculos = [];
        this.sendOperations = [];
        this.showNewEscenario = [];
      } else {
        this.variableSelect1 = '';
        this.variableSelect2 = '';
        this.variableDescription = '';
        this.variableUnidad = undefined;
        this.variableName = '';
        this.editVariableName = false;
        this.editVariableDescription = false;
        this.editVariableUnidad = false;
        this.isOperation = false;
        this.constante = true;
        this.calculos = [];
        this.sendOperations = [];
        this.showNewEscenario = [];
        this.variableUnidad = undefined;
        this.min = 0;
        this.max = 0;
        this.stDev = 0;
      } */
    });
  }
  editVariableNameClick() {
    this.editVariableName = !this.editVariableName;
  }

  editVariableDescriptionClick() {
    this.editVariableDescription = !this.editVariableDescription;
  }

  editVariableAll() {
    this.editVariableDescription = true;
  }

  sendData() {
    this.sendDataEvent.emit({
      name: this.variableName,
      description: this.variableDescription,
      operation: !this.constante,
      constante: this.constante,
      formula: this.sendOperations,
      unite: this.variableUnidad,
      new_formula: this.calculos,
      distribution_shape: [
        {
          name:
            this.shapeData.__zone_symbol__value.name !== 'SyntaxError'
              ? this.shapeData.__zone_symbol__value.name
              : 'Normal',
          max: +this.max,
          stDev: +this.stDev,
          min: +this.min,
          rate: +this.rate,
          mean: +this.mean,
          form: +this.form,
          alpha: +this.alpha,
          beta: +this.beta,
          success: +this.success,
          population: +this.population,
          trials: +this.trials,
          probability: +this.probability,
          scale: +this.scale,
          lamda: +this.lamda,
          mode: +this.mode,
          type: this.shapeData.__zone_symbol__value.type,
        },
      ],
    });

    this.cerrarModal();
    this.sendOperations = [];
    this.tempObject.push({
      name: this.variableName,
      description: this.variableDescription,

      operation: !this.constante,
      constante: this.constante,
    });
  }
  editData() {
    this.editDataEvent.emit({
      id: this.nodeId,
      name: this.variableName,
      description: this.variableDescription,
      formula: this.sendOperations ? this.sendOperations : null,
      operation: !this.constante,
      constante: this.constante,
      unite: this.variableUnidad ?? 0,
      new_formula: this.calculos,
      distribution_shape: [
        {
          name:
            this.shapeData.__zone_symbol__value.name !== 'SyntaxError'
              ? this.shapeData.__zone_symbol__value.name
              : 'Normal',
          max: +this.max,
          stDev: +this.stDev,
          min: +this.min,
          rate: +this.rate,
          mean: +this.mean,
          form: +this.form,
          alpha: +this.alpha,
          beta: +this.beta,
          success: +this.success,
          population: +this.population,
          trials: +this.trials,
          probability: +this.probability,
          scale: +this.scale,
          lamda: +this.lamda,
          mode: +this.mode,
          type: this.shapeData.__zone_symbol__value.type,
        },
      ],
    });

    this.scenarioYears[this.defaultYear] = this.variableUnidad;

    console.log(this.scenarioId, 'ID ESCENARIO');

    this.projectSvc
      .updateScenery(this.scenarioId, { years: this.scenarioYears })
      .subscribe();

    this.cerrarModal();

    this.tempObject[this.variableId] = {
      name: this.variableName,
      description: this.variableDescription,

      operation: !this.constante,
      constante: this.constante,
    };
  }
  cerrarModal() {
    // Obtén el botón que tiene el atributo data-bs-dismiss dentro del modal
    const closeButton = document.querySelector('[data-bs-dismiss="modal"]');

    // Verifica si el botón existe antes de intentar cerrar el modal
    if (closeButton) {
      // Simula un clic en el botón para cerrar el modal
      (closeButton as HTMLElement).click();
    }
  }

  onInputChange(event: any, field: string) {
    const target = event.target as HTMLElement;
    if (field === 'variable') {
      this.variableName = target.innerText;
      this.saveCursorPosition(event.target);

      this.restoreCursorPosition(event.target);
    } else if (field === 'descripcion') {
      this.saveCursorPosition(event.target);
      this.variableDescription = target.innerText;
      this.restoreCursorPosition(event.target);
    }
  }

  submit() {
    if (this.editVariable) {
      if (this.disable()) {
        Swal.fire({
          title: 'Error',
          text: 'The name are required.',
          icon: 'error',
          iconColor: '#BC5800',
          customClass: {
            confirmButton: 'confirm',
            cancelButton: 'cancel',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const openButton = document.querySelector('#exampleModalButton');

            // Verifica si el botón existe antes de intentar cerrar el modal
            if (openButton) {
              // Simula un clic en el botón para cerrar el modal
              (openButton as HTMLElement).click();
            }
          }
        });
      } else {
        this.editData();
        this.deleteShapeData();
      }
    } else {
      if (this.disable()) {
        Swal.fire({
          title: 'Error',
          text: 'The name  are required.',
          icon: 'error',
          iconColor: '#BC5800',
          customClass: {
            confirmButton: 'confirm',
            cancelButton: 'cancel',
          },
        }).then((result) => {
          if (result.isConfirmed) {
            const openButton = document.querySelector('#exampleModalButton');

            // Verifica si el botón existe antes de intentar cerrar el modal
            if (openButton) {
              // Simula un clic en el botón para cerrar el modal
              (openButton as HTMLElement).click();
            }
          }
        });
      } else {
        this.sendData();
        this.deleteShapeData();
      }
    }
  }
  editVariableUnidadClick() {
    this.editVariableUnidad = !this.editVariableUnidad;
  }

  operation(id1: any, id2: any) {
    const unidad1 = this.onlyConst[+id1]?.unidad;
    const unidad2 = this.onlyConst[+id2]?.unidad;

    // Verificar si las propiedades existen antes de intentar acceder a ellas
    if (unidad1 !== undefined && unidad2 !== undefined) {
      return +unidad1 + +unidad2;
    } else {
      // Manejar el caso en que alguna de las propiedades es 'undefined'
      return 0;
    }
  }
  updateVariables(): void {
    /*     this.variables = this.variables.filter(
      (variable) => variable.id !== this.nodeId
    ); */

    console.log('UPDATE VARIBALE');

    if (this.editVariable) {
      this.cargando = true;
      this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
        this.variableUnidad = res.sceneries[this.scenerieId].years[
          this.defaultYear
        ]
          ? res.sceneries[this.scenerieId].years[this.defaultYear]
          : undefined;

        this.scenarioId = res.sceneries[this.scenerieId].id ?? undefined;

        this.scenarioYears = res.sceneries[this.scenerieId].years;

        const shapeDataExists = localStorage.getItem('shapeData') !== null;

        // Si shapeData no existe, entonces lo establecemos
        if (!shapeDataExists) {
          this.min = res.distribution_shape[0]?.min || this.min;
          this.max = res.distribution_shape[0]?.max || this.max;
          this.stDev = res.distribution_shape[0]?.stDev || this.stDev;
          this.rate = res.distribution_shape[0]?.rate || this.rate;
          this.mean = res.distribution_shape[0]?.mean || this.mean;
          this.mode = res.distribution_shape[0]?.mode || this.mode;
          this.lamda = res.distribution_shape[0]?.lamda || this.lamda;
          this.trials = res.distribution_shape[0]?.trials || this.trials;
          this.probability =
            res.distribution_shape[0]?.probability || this.probability;
          this.scale = res.distribution_shape[0]?.scale || this.scale;
          this.form = res.distribution_shape[0]?.form || this.form;
          this.alpha = res.distribution_shape[0]?.alpha || this.alpha;
          this.beta = res.distribution_shape[0]?.beta || this.beta;
          this.success = res.distribution_shape[0]?.success || this.success;
          this.population =
            res.distribution_shape[0]?.population || this.population;

          const formShape = {
            min: this.min,
            stDev: this.stDev,
            max: this.max,
            rate: this.rate,
            mean: this.mean,
            form: +this.form,
            alpha: +this.alpha,
            beta: +this.beta,
            success: +this.success,
            population: +this.population,
            trials: +this.trials,
            probability: +this.probability,
            scale: +this.scale,
            lamda: +this.lamda,
            mode: +this.mode,
            name: res.distribution_shape[0]?.name
              ? res.distribution_shape[0]?.name
              : 'Normal',
            type: res.distribution_shape[0]?.type
              ? res.distribution_shape[0]?.type
              : 'static',
          };
          localStorage.setItem('shapeData', JSON.stringify(formShape));
          this.shapeData = this.getItem('shapeData');

          const chartName = res.distribution_shape[0]?.name
            ? res.distribution_shape[0]?.name
            : 'Normal';

          if (this.chart) {
            this.chart.destroy();
          }

          switch (chartName) {
            case 'Normal':
              this.normalChart();
              break;
            case 'SyntaxError':
              this.normalChart();
              break;
            case 'Uniforme':
              this.uniformChart();
              break;
            case 'Exponencial':
              this.exponentialChart();
              break;
            case 'Triangular':
              this.triangularChart();
              break;
            case 'Poisson':
              this.poissonChart();
              break;

            case 'Binominal':
              this.binomialChart();
              break;

            case 'Geometric':
              this.geometricChart();
              break;
            case 'Weibull':
              this.weibullChart();
              break;
            case 'Beta':
              this.betaChart();
              break;
            case 'Hypergeometric':
              this.hypergeometricChart();
              break;
            case 'Lognormal':
              this.lognormalChart();
              break;
            default:
              console.error(`Tipo de gráfico no reconocido: ${chartName}`);
          }
        }
        this.constante = res.type === 1 ? true : false;
        this.oldType = res.type === 1 ? true : false;
        this.variableName = res.name;
        this.variableDescription = res.description;
        this.calculos = res.new_formula ? res.new_formula : [];
        this.sendOperations = res.formula ? res.formula : [];
        this.showNewEscenario = res.calculated ? res.calculated : [];
        this.editableContent.nativeElement.innerText =
          this.variableDescription || 'Insert a description';

        this.editableConstante.nativeElement.innerText =
          this.variableName || 'Insert a name';
        this.cargando = false;
      });
    }
  }
  hiddenData() {
    this.hiddenDataEvent.emit();
  }
  disable() {
    if (this.variableName) {
      return false;
    } else {
      return true;
    }
  }

  arrayFilter(): Array<any> {
    this.onlyConst = this.tempObject.filter((obj) => obj.operation === false);
    return this.tempObject.filter((obj) => obj.operation === false);
  }

  addVariable(variable: any, id: any) {
    if (
      this.operators.includes(this.calculos[this.calculos.length - 1]?.name)
    ) {
      if (variable.type === 2) {
        [variable.calculated].forEach((e: any) => {
          e.operation = this.calculos[this.calculos.length - 1]?.name;
        });
      } else {
        [variable.sceneries].forEach((e: any) => {
          e.operation = this.calculos[this.calculos.length - 1]?.name;
        });
      }
    }

    variable.isActive = true;

    this.calculos.push({ name: variable.name, operator: false, id: id });
    const variableTo =
      variable.type === 2 ? variable.calculated : variable.sceneries;
    this.operations.push(variableTo);

    this.calculos[this.calculos.length - 1];

    /*  this.operationResult(); */
    this.sendOperations.push(id);
  }
  operationResult() {
    type YearValue = {
      [key: number]: string;
    };

    type Scenario = {
      name: string;
      years: YearValue[];
    };

    const newEscenario: any = [];
    const escenarios = JSON.parse(JSON.stringify(this.operations));

    for (let i = 0; i < escenarios.length; i++) {
      const element = escenarios[i];
      for (let i = 0; i < element.length; i++) {
        const element2 = element[i];
        const escenarioExiste = newEscenario.some(
          (objeto: any) => objeto.name === element2.name
        );
        if (this.operators.includes(element2.name)) {
          newEscenario.forEach((e: any) => {
            [e.years].forEach((year: any) => {
              Object.entries(year).forEach(([clave, valor]) => {
                [e.years][0][clave] = `${(valor as string) + element2.name}`;
                try {
                  [e.years][0][clave] = eval([e.years][0][clave]);
                } catch (error) {}
              });
            });
          });
        }

        if (!escenarioExiste && !this.operators.includes(element2.name)) {
          newEscenario.push({ name: element2.name, years: element2.years });
        } else if (!this.operators.includes(element2.name)) {
          const objetoConNombre = newEscenario.find(
            (obj: any) => obj.name === element2.name
          );
          [objetoConNombre.years].forEach((year: any) => {
            Object.entries(year).forEach(([clave, valor]) => {
              try {
                [objetoConNombre.years][0][clave] = eval(
                  `${(valor as string) + element2.years[clave as any]}`
                );
              } catch (error) {
                [objetoConNombre.years][0][clave] = `${
                  (valor as string) + element2.years[clave as any]
                }`;
              }
            });
          });
        }
      }
    }

    this.showNewEscenario = newEscenario;
  }

  addCalculo(operation: any) {
    // if (this.sendOperations.length > 0) {

    this.calculos.push({
      name: operation.operator,
      img: operation.img,
      operator: true,
      id: operation.operator,
    });
    this.operations.push([{ name: operation.operator }]);

    this.sendOperations.push(operation.operator);
    // }

    /*   this.operationResult(); */
  }

  addCustom() {
    if (this.inputValue.toString().includes('%')) {
      const valueBase = parseFloat(this.inputValue.toString().replace('%', ''));

      this.inputValue = (+valueBase / 100).toString();
    }

    this.calculos.push({ name: this.inputValue, operator: false });
    this.operations.push([{ name: this.inputValue }]);

    this.sendOperations.push(this.inputValue);

    this.inputValue = '';
    this.mostrarPopover = false; //
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
  }
  submitEdit() {
    const editVariable = {
      name: this.variableName,
      description: this.variableDescription,
      formula: this.sendOperations,
      new_formula: this.calculos,
    };

    this.projectSvc
      .updateNode(this.nodeId, editVariable)
      .subscribe((res: any) => {});
  }

  elimateNode() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to reverse this action.',
      icon: 'question',
      iconColor: '#BC5800',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancelar',
      customClass: {
        confirmButton: 'confirm',
        cancelButton: 'cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectSvc.deleteNode(this.nodeId).subscribe((res: any) => {
          this.deleteNode.emit();
          Swal.fire({
            title: 'Delete!',
            text: 'The node was deleted successfully!',
            icon: 'success',
          });
          this.deleteShapeData();
        });
      }

      if (result.isDenied) {
        const openButton = document.querySelector('#exampleModalButton');

        // Verifica si el botón existe antes de intentar cerrar el modal
        if (openButton) {
          // Simula un clic en el botón para cerrar el modal
          (openButton as HTMLElement).click();
        }
      }
      if (result.isDismissed) {
        const openButton = document.querySelector('#exampleModalButton');

        // Verifica si el botón existe antes de intentar cerrar el modal
        if (openButton) {
          // Simula un clic en el botón para cerrar el modal
          (openButton as HTMLElement).click();
        }
      }
    });
  }

  verifyType() {
    if (this.editVariable) {
      setTimeout(() => {
        if (this.oldType !== this.constante) {
          Swal.fire({
            title: 'Are you sure?',
            text: 'If you change the type, the associated data will be lost.',
            icon: 'question',
            iconColor: '#BC5800',

            confirmButtonText: 'ok',
            customClass: {
              confirmButton: 'confirm',
              cancelButton: 'cancel',
            },
          });
        }
      }, 100);
    }
  }

  getItem(key: any) {
    return new Promise((resolve) => {
      const value = localStorage.getItem(key);

      const def =
        '{"name":"Normal","min":"0","max":"0","stDev":"0","rate":"0","mean":"0","type":"static","form":"0","alpha":"0","beta":"0","success":"0","population":"0","trials":"0","probability":"0","scale":"0","lamda":"0","mode":"0"}';
      resolve(JSON.parse(value || def));
    });
  }

  normalChart() {
    // Definir la media y la desviación estándar
    if (this.mean.toString().includes('%')) {
      const valueBase = parseFloat(this.mean.toString().replace('%', ''));

      this.mean = +valueBase / 100;
    }

    if (this.stDev.toString().includes('%')) {
      const valueBase = parseFloat(this.stDev.toString().replace('%', ''));

      this.stDev = +valueBase / 100;
    }
    var mu = +this.mean,
      sigma = +this.stDev,
      samples = 1000;

    // Generar una distribución normal
    // Generar una distribución normal
    var s = [];
    for (var i = 0; i < samples; i++) {
      s.push(
        mu +
          sigma *
            Math.sqrt(-2.0 * Math.log(Math.random())) *
            Math.cos(2.0 * Math.PI * Math.random())
      );
    }
    // Crear el histograma
    var histogram = new Array(samples).fill(0);
    for (var i = 0; i < s.length; i++) {
      histogram[Math.floor(((s[i] - mu + 5 * sigma) / (10 * sigma)) * 100)]++;
    }

    var binWidth = (10 * sigma) / 100;
    histogram = histogram.map(function (value) {
      return value / (binWidth * s.length);
    });

    // Crear la curva de la función de densidad de probabilidad
    var x = Array.from(
      { length: 100 },
      (_, i) => mu - 5 * sigma + (i * (10 * sigma)) / 100
    );
    var y = x.map(function (x) {
      return (
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-((+x - mu) ** 2) / (2 * sigma ** 2))
      );
    });

    // Crear el gráfico

    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: x,
        datasets: [
          {
            label: 'Theoretical distribution',
            data: y,
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 1,
          },
          {
            type: 'bar',
            label: 'Normal',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          yAxes: {
            beginAtZero: true,
            ticks: {},
          },
          y: {
            display: false,
          },
        },
      },
    });
  }

  changeValueNormal() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.normalChart();
  }

  triangularChart() {
    // Función para generar números aleatorios con distribución triangular
    function triangularDistribution(
      sampleSize: any,
      low: number,
      mode: number,
      high: number
    ) {
      const triangularSamples = [];
      for (let i = 0; i < sampleSize; i++) {
        const u = Math.random();
        const f = (mode - low) / (high - low);
        if (u <= f) {
          triangularSamples.push(
            low + Math.sqrt(u * (high - low) * (mode - low))
          );
        } else {
          triangularSamples.push(
            high - Math.sqrt((1 - u) * (high - low) * (high - mode))
          );
        }
      }
      return triangularSamples;
    }

    // Definir parámetros de la distribución triangular
    const sampleSize = 1000;

    // Generar números aleatorios con distribución triangular
    const triangularSamples = triangularDistribution(
      sampleSize,
      +this.min,
      +this.mode,
      +this.max
    );

    // Calcular el histograma
    const numBins = 20; // Número de bins para el histograma
    const binWidth = (+this.max - +this.min) / numBins;
    const histogram = new Array(numBins).fill(0);

    triangularSamples.forEach((value) => {
      if (value >= +this.min && value <= +this.max) {
        const binIndex = Math.floor((value - +this.min) / binWidth);
        histogram[binIndex]++;
      }
    });

    // Preparar datos para el histograma
    const labels = Array.from(
      { length: numBins },
      (_, i) => +(+this.min + i * binWidth)
    );

    const data = histogram.map((count) => count / sampleSize / binWidth);

    // Calcular la PDF teórica
    const pdf = labels.map((x) => {
      if (x < +this.mode) {
        return (
          (2 * (x - +this.min)) /
          ((+this.max - +this.min) * (+this.mode - +this.min))
        );
      } else {
        return (
          (2 * (+this.max - x)) /
          ((+this.max - +this.min) * (+this.max - +this.mode))
        );
      }
    });

    // Crear un histograma con Chart.js (gráfico de barras) y agregar la PDF
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Theoretical distribution',
            data: pdf,
            borderColor: '#FF6347',
            borderWidth: 2,
            fill: false,
            type: 'line',
            yAxisID: 'y1',
          },
          {
            label: 'Histogram',
            data: data,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
            yAxisID: 'y',
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Value',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency',
            },
            position: 'left',
          },
          y1: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Probability Density',
            },
            position: 'right',
            grid: {
              drawOnChartArea: false,
            },
          },
        },
      },
    });
  }
  changeValueTriangular() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.triangularChart();
  }

  poissonChart() {
    // Función para generar números aleatorios con distribución de Poisson
    function poissonDistribution(sampleSize: any, lambda: any) {
      const poissonSamples = [];
      for (let i = 0; i < sampleSize; i++) {
        let L = Math.exp(-lambda);
        let k = 0;
        let p = 1.0;
        do {
          k++;
          p *= Math.random();
        } while (p > L);
        poissonSamples.push(k - 1);
      }
      return poissonSamples;
    }

    // Función para calcular la PMF teórica de la distribución de Poisson
    function poissonPMF(lambda: number, k: number) {
      return (Math.pow(lambda, k) * Math.exp(-lambda)) / factorial(k);
    }

    // Función para calcular el factorial de un número
    function factorial(n: number): number {
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    }

    // Definir parámetros de la distribución de Poisson
    const sampleSize = 1000;
    const lambda = this.lamda; // Parámetro lambda

    // Generar números aleatorios con distribución de Poisson
    const poissonSamples = poissonDistribution(sampleSize, lambda);

    // Calcular el histograma
    const maxVal = Math.max(...poissonSamples);
    const minVal = Math.min(...poissonSamples);
    const numBins = maxVal - minVal + 1;

    let histogram = new Array(numBins).fill(0);
    for (let i = 0; i < poissonSamples.length; i++) {
      histogram[poissonSamples[i] - minVal]++;
    }

    // Normalizar el histograma
    for (let i = 0; i < histogram.length; i++) {
      histogram[i] /= poissonSamples.length;
    }

    // Calcular la PMF teórica
    const pmf = new Array(numBins)
      .fill(0)
      .map((_, i) => poissonPMF(lambda, i + minVal));

    // Crear un histograma con Chart.js (gráfico de barras) y agregar la PMF
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: Array.from({ length: histogram.length }, (_, i) => i + minVal),
        datasets: [
          {
            label: 'Theoretical distribution',
            data: pmf,
            borderColor: '#FF6347',
            borderWidth: 2,
            fill: false,
            type: 'line',
          },
          {
            label: 'Histogram',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Value',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Frequency',
            },
          },
        },
      },
    });
  }
  changeValuePoisson() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.poissonChart();
  }

  binomialChart() {
    // Función para generar números aleatorios con distribución binomial
    function binomialDistribution(sampleSize: any, n: any, p: any) {
      const binomialSamples = [];
      for (let i = 0; i < sampleSize; i++) {
        let successes = 0;
        for (let j = 0; j < n; j++) {
          if (Math.random() < p) {
            successes++;
          }
        }
        binomialSamples.push(successes);
      }
      return binomialSamples;
    }

    // Función para calcular la PMF teórica de la distribución binomial
    function binomialPMF(n: number, p: number, k: number) {
      function factorial(x: number): number {
        if (x === 0 || x === 1) return 1;
        return x * factorial(x - 1);
      }
      return (
        (factorial(n) / (factorial(k) * factorial(n - k))) *
        Math.pow(p, k) *
        Math.pow(1 - p, n - k)
      );
    }

    // Definir parámetros de la distribución binomial
    const sampleSize = 1000;
    const n = this.trials > 0 ? this.trials : 1; // Número de ensayos
    const p = this.probability; // Probabilidad de éxito en cada ensayo

    // Generar números aleatorios con distribución binomial
    const binomialSamples = binomialDistribution(sampleSize, n, p);

    // Calcular el histograma
    const maxVal = Math.max(...binomialSamples);
    const minVal = Math.min(...binomialSamples);
    const numBins = maxVal - minVal + 1;
    const histogram = new Array(numBins).fill(0);

    binomialSamples.forEach((value) => {
      histogram[value - minVal]++;
    });

    // Normalizar el histograma
    for (let i = 0; i < histogram.length; i++) {
      histogram[i] /= binomialSamples.length;
    }

    // Calcular la PMF teórica
    const labels = Array.from({ length: numBins }, (_, i) => i + minVal);
    const pmf = labels.map((k) => binomialPMF(n, p, k));

    // Crear un histograma con Chart.js (gráfico de barras) y agregar la PMF
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Theoretical distribution',
            data: pmf,
            borderColor: '#FF6347',
            borderWidth: 2,
            fill: false,
            type: 'line',
          },
          {
            label: 'Binomial',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Number of Successes',
            },
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Probability',
            },
          },
        },
      },
    });
  }

  changeValueBinomial() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.binomialChart();
  }

  weibullChart() {
    // Parámetros de la distribución de Weibull
    const k = this.form; // Parámetro de forma
    const lambda = this.scale; // Parámetro de escala
    const sampleSize = 1000;

    // Función para generar números aleatorios con distribución de Weibull
    function generateWeibullSamples(k: number, lambda: number, size: number) {
      const samples: number[] = [];
      for (let i = 0; i < size; i++) {
        const u = Math.random();
        const sample = lambda * Math.pow(-Math.log(1 - u), 1 / k);
        samples.push(sample);
      }
      return samples;
    }

    // Generar los datos de Weibull
    const weibullSamples = generateWeibullSamples(k, lambda, sampleSize);

    // Crear bins para el histograma
    function createHistogram(samples: number[], binCount: number) {
      const max = Math.max(...samples);
      const min = Math.min(...samples);
      const binWidth = (max - min) / binCount;
      const bins = Array(binCount).fill(0);
      samples.forEach((sample: number) => {
        const index = Math.min(
          Math.floor((sample - min) / binWidth),
          binCount - 1
        );
        bins[index]++;
      });
      return bins.map((count) => count / (samples.length * binWidth)); // Densidad de probabilidad
    }

    const binCount = 20;
    const hist = createHistogram(weibullSamples, binCount);

    // Calcular los puntos medios de los bins
    const binEdges = Array.from(
      { length: binCount + 1 },
      (_, i) => i * (Math.max(...weibullSamples) / binCount)
    );
    const binMids: any = binEdges
      .slice(0, -1)
      .map((edge, index) => (edge + binEdges[index + 1]) / 2);

    // Función para calcular la PDF de Weibull
    function weibullPDF(x: number, k: number, lambda: number) {
      return (
        (k / lambda) *
        Math.pow(x / lambda, k - 1) *
        Math.exp(-Math.pow(x / lambda, k))
      );
    }

    // Calcular los valores de la PDF para los puntos medios de los bins
    const pdfValues = binMids.map((x: any) =>
      weibullPDF(parseFloat(x), k, lambda)
    );

    // Configurar los datos para Chart.js
    const chartData: ChartData<'bar' | 'line', number[], string> = {
      labels: binMids,
      datasets: [
        {
          label: 'Weibull',
          data: hist,
          backgroundColor: '#8C64B1',
          borderColor: '#8C64B1',
          borderWidth: 1,
        },
        {
          label: 'Theoretical distribution',
          data: pdfValues,
          type: 'line',
          fill: false,
          borderColor: '#FF5733',
          borderWidth: 2,
        },
      ],
    };

    // Configurar las opciones del gráfico
    const chartOptions: ChartOptions = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Valor',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Densidad de Probabilidad',
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Histograma y Función de Densidad de Probabilidad de Distribución de Weibull',
        },
      },
    };

    // Crear el gráfico
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });
  }

  changeValueWeibull() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.weibullChart();
  }

  lognormalChart() {
    // Parámetros de la distribución logarítmico normal
    const mean = this.mean;
    const stDev = this.stDev;
    const mu = Math.log(mean ** 2 / Math.sqrt(stDev ** 2 + mean ** 2)); // Media logarítmica corregida
    const sigma = Math.sqrt(Math.log(1 + stDev ** 2 / mean ** 2)); // Desviación estándar logarítmica corregida

    // Función de densidad de probabilidad (PDF) de la distribución logarítmica normal
    function lognormalPDF(x: any) {
      const coefficient = 1 / (x * sigma * Math.sqrt(2 * Math.PI));
      const exponent = -((Math.log(x) - mu) ** 2) / (2 * sigma ** 2);
      return coefficient * Math.exp(exponent);
    }

    // Datos para el gráfico
    const labels = [];
    const data = [];

    // Calcular datos para el gráfico
    const step = 2; // Mostrar cada 2 puntos en el eje x
    for (let x = 1; x <= 200; x += 0.1 * step) {
      const pdf = lognormalPDF(x);
      if (pdf > 0.001) {
        // Filtrar valores cercanos a cero
        labels.push(x);
        data.push(pdf);
      }
    }

    // Crear gráfico
    this.chart = new Chart('myChart', {
      type: 'bar', // Cambiar a 'line' para representar correctamente la PDF
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Lognormal',
            data: data,
            backgroundColor: 'rgba(140, 100, 177, 0.2)', // Color con transparencia
            borderColor: '#8C64B1',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: true,
              text: 'Valor',
            },
            ticks: {
              stepSize: 20, // Mostrar cada 20 puntos en el eje x
            },
          },
          y: {
            title: {
              display: true,
              text: 'Probability density',
            },
          },
        },
      },
    });
  }

  changeValueLognormal() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.lognormalChart();
  }

  betaChart() {
    // Parámetros de la distribución beta
    const alpha = this.alpha; // Parámetro de forma
    const beta = this.beta; // Parámetro de forma
    const size = 1000; // Tamaño de la muestra

    // Generar muestras de la distribución beta
    const samples = Array.from({ length: size }, () => {
      return Math.random() ** alpha * (1 - Math.random()) ** beta;
    });

    // Histograma de las muestras generadas
    const bins = 50;
    const histogramData = Array.from({ length: bins }, (_, i) => {
      const binStart = i / bins;
      const binEnd = (i + 1) / bins;
      return (
        samples.filter((value) => value >= binStart && value < binEnd).length /
        size
      );
    });

    // Función de densidad de probabilidad de la distribución beta
    function betaPDF(x: any, alpha: any, beta: any) {
      return (
        (Math.pow(x, alpha - 1) * Math.pow(1 - x, beta - 1)) /
        (Math.pow(1, alpha - 1) * Math.pow(1, beta - 1))
      );
    }

    // Datos para trazar la función de densidad de probabilidad
    const pdfData = {
      labels: [] as string[],
      datasets: [
        {
          label: 'Beta',
          data: [] as number[],
          fill: false,
          backgroundColor: '#8C64B1',
          borderColor: '#8C64B1',
          tension: 0.1,
        },
      ],
    };

    // Generar puntos para la función de densidad de probabilidad
    for (let i = 0; i <= 1; i += 0.01) {
      pdfData.labels.push(`${i}`); // Redondeamos para evitar números largos
      pdfData.datasets[0].data.push(betaPDF(i, alpha, beta));
    }

    // Configurar opciones del gráfico
    const options = {
      scales: {
        x: {
          title: {
            display: false,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Densidad de probabilidad',
          },
        },
      },
    };

    // Crear el gráfico de línea para la función de densidad de probabilidad

    this.chart = new Chart('myChart', {
      type: 'bar',
      data: pdfData,
      options: options,
    });

    // Añadir el histograma como un gráfico de barras en la parte derecha
    this.chart.data.datasets.push({
      label: 'Histograma',
      data: histogramData,
      backgroundColor: 'rgba(255, 99, 132, 0.6)',
      borderWidth: 1,
      type: 'bar',
    });
  }

  changeValueBeta() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.betaChart();
  }

  hypergeometricChart() {
    // Parámetros de la distribución hipergeométrica
    const M = +this.population; // Tamaño de la población
    const n = +this.success; // Número de éxitos en la población
    const N = +this.trials; // Tamaño de la muestra

    // Función de densidad de probabilidad de la distribución hipergeométrica
    function hypergeometricPDF(k: number, M: number, n: number, N: number) {
      const coef =
        (binomialCoefficient(n, k) * binomialCoefficient(M - n, N - k)) /
        binomialCoefficient(M, N);
      return coef;
    }

    // Función para calcular el coeficiente binomial
    function binomialCoefficient(n: number, k: number) {
      let coeff = 1;
      for (let x = n - k + 1; x <= n; x++) coeff *= x;
      for (let x = 1; x <= k; x++) coeff /= x;
      return coeff;
    }

    // Calcular los valores para la función de densidad de probabilidad
    const pdfData = [];
    for (let k = 0; k <= N; k++) {
      pdfData.push(hypergeometricPDF(k, M, n, N));
    }

    // Configurar los datos para el gráfico
    const bins = Array.from({ length: N + 1 }, (_, i) => i);

    // Configurar opciones del gráfico
    const options = {
      scales: {
        x: {
          title: {
            display: true,
            text: 'Valor',
          },
        },
        y: {
          title: {
            display: true,
            text: 'Densidad de probabilidad',
          },
          beginAtZero: true,
        },
      },
    };

    // Crear el gráfico de barras usando Chart.js
    this.chart = new Chart('myChart', {
      data: {
        labels: bins,
        datasets: [
          {
            label: 'Hypergeometric',
            data: pdfData,
            backgroundColor: 'rgba(140, 100, 177, 0.6)',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
            yAxisID: 'y',
          },
          {
            label: 'Theoretical distribution',
            data: pdfData,
            borderColor: '#FF6347',
            backgroundColor: '#FF6347',
            borderWidth: 2,
            type: 'line',
            fill: false,
            yAxisID: 'y',
          },
        ],
      },
      options: options,
    });
  }

  changeValueHypergeometric() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.hypergeometricChart();
  }

  geometricChart() {
    // Parámetros de la distribución geométrica
    const p = this.probability == 0 ? 0.1 : this.probability; // Probabilidad de éxito en cada intento
    const size = 10000; // Tamaño de la muestra

    // Generar muestras de la distribución geométrica
    const samples = Array.from({ length: size }, () => {
      let attempts = 1;
      while (Math.random() >= p) {
        attempts++;
      }
      return attempts;
    });

    // Calcular el histograma de las muestras
    const histogramData = samples.reduce((histogram: any, value: any) => {
      histogram[value] = (histogram[value] || 0) + 1;
      return histogram;
    }, {});

    // Convertir el histograma en un formato compatible con Chart.js
    const labels = Object.keys(histogramData).map((bin) => parseInt(bin));
    const histogram = Object.values(histogramData).map(
      (count: any) => count / size
    );

    // Calcular la PMF teórica
    const pmf = labels.map((k) => p * Math.pow(1 - p, k - 1));

    // Crear el gráfico de barras usando Chart.js y agregar la PMF
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Geometric',
            data: pmf,
            borderColor: '#FF6347',
            borderWidth: 2,
            fill: false,
            type: 'line',
          },
          {
            label: 'Histogram',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
            type: 'bar',
          },
        ],
      },
      options: {
        scales: {
          x: {
            title: {
              display: false,
              text: 'Número de intentos hasta el primer éxito',
            },
          },
          y: {
            title: {
              display: false,
              text: 'Probabilidad',
            },
          },
        },
      },
    });
  }

  changeValueGeometrica() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.geometricChart();
  }

  uniformChart() {
    if (this.min.toString().includes('%')) {
      const valueBase = parseFloat(this.min.replace('%', ''));

      this.min = +valueBase / 100;
    }

    if (this.max.toString().includes('%')) {
      const valueBase = parseFloat(this.max.replace('%', ''));

      this.max = +valueBase / 100;
    }

    var min = +this.min;
    var max = +this.max;

    // Generar muestras de la distribución
    var s = [];
    for (var i = 0; i < 1000; i++) {
      s.push(min + Math.random() * (max - min));
    }

    // Verificar que todos los valores están dentro del intervalo dado

    // Crear el histograma
    var histogram = new Array(15).fill(0);
    for (var i = 0; i < s.length; i++) {
      histogram[Math.floor((s[i] - min) / ((max - min) / 15))]++;
    }

    // Normalizar el histograma
    var binWidth = (max - min) / 15;
    histogram = histogram.map(function (value) {
      return value / (binWidth * s.length);
    });

    // Crear el gráfico

    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: Array.from({ length: 15 }, (_, i) =>
          (min + i * binWidth).toFixed(2)
        ),
        datasets: [
          {
            type: 'line',
            label: 'Theoretical distribution',
            fill: false,
            data: Array.from({ length: 15 }, () => 1),
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 2,
          },
          {
            label: 'Unirform',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '##8C64B1',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {},
      },
    });
  }
  changeValueUniforme() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.uniformChart();
  }

  exponentialChart() {
    // Escala de la distribución exponencial

    this.rate = `${this.rate}`;

    if (this.rate.includes('%')) {
      const valueBase = parseFloat(this.rate.replace('%', ''));

      this.rate = +valueBase / 100;
    }
    let rate = +this.rate; // Cambia este valor para ajustar la escala

    // Dibujar muestras de la distribución exponencial
    let s = [];
    for (let i = 0; i < 1000; i++) {
      s.push(-rate * Math.log(1.0 - Math.random()));
    }

    // Crear el histograma
    let histogram = new Array(50).fill(0);
    for (let i = 0; i < s.length; i++) {
      histogram[Math.min(Math.floor(s[i] / (10 / 50)), histogram.length - 1)]++;
    }

    // Normalizar el histograma
    let binWidth = 10 / 50;
    histogram = histogram.map((value) => value / (binWidth * s.length));

    // Crear bins para el histograma
    let bins = Array.from({ length: histogram.length }, (_, i) => i * binWidth);

    // Crear PDF de la distribución exponencial
    let pdf = bins.map((bin) => Math.exp(-bin));

    // Crear el gráfico con Chart.js
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: bins,
        datasets: [
          {
            label: 'Theoretical distribution',
            data: pdf,
            fill: false,
            borderColor: 'rgba(255, 0, 0, 1)',
            borderWidth: 1,
            type: 'line',
          },
          {
            label: 'Exponential',
            data: histogram,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            display: false,
          },
          yAxes: {
            beginAtZero: true,
            ticks: {},
          },
        },
      },
    });
  }

  changeValueExponential() {
    if (this.chart) {
      this.chart.destroy();
    }
    this.exponentialChart();
  }

  deleteShapeData() {
    localStorage.removeItem('shapeData');
    localStorage.removeItem('shapetype');

    this.variableSelect1 = '';
    this.variableSelect2 = '';
    this.variableDescription = '';
    this.editableContent.nativeElement.innerText = '';
    this.editableConstante.nativeElement.innerText = '';
    this.variableUnidad = undefined;
    this.variableName = '';
    this.editVariableName = false;
    this.editVariableDescription = false;
    this.editVariableUnidad = false;
    this.isOperation = false;
    this.constante = true;
    this.calculos = [];
    this.sendOperations = [];
    this.showNewEscenario = [];
    this.scenarioId = null;

    this.min = 0;
    this.max = 0;
    this.stDev = 0;
    this.mean = 0;
    this.rate = 0;
  }

  saveNewValue() {
    if (this.variableUnidad.includes('%')) {
      const valueBase = parseFloat(this.variableUnidad.replace('%', ''));

      this.variableUnidad = +valueBase / 100;
    }
    this.events.publish('changeEditUnite', this.variableUnidad);
  }

  changePercentage() {
    if (this.variableUnidad.includes('%')) {
      const valueBase = parseFloat(this.variableUnidad.replace('%', ''));

      this.variableUnidad = +valueBase / 100;
    }
  }

  removeStorage() {
    localStorage.removeItem('shapeData');
    localStorage.removeItem('shapetype');
  }

  setEvent() {
    this.openUnite();
  }

  async openUnite() {
    this.cargando = true;
    if (this.editVariable) {
      this.editDataEvent.emit({
        id: this.nodeId,

        unite: this.variableUnidad ?? 0,
      });

      const resScenarioYears: any = await firstValueFrom(
        this.projectSvc.getScenery(this.scenarioId)
      );
      this.scenarioYears = resScenarioYears.years;
      this.scenarioYears[this.defaultYear] = this.variableUnidad;

      this.projectSvc
        .updateScenery(this.scenarioId, { years: this.scenarioYears })
        .subscribe((res: any) => {
          const openButton = document.querySelector('#uniteModalButton');

          if (openButton) {
            (openButton as HTMLElement).click();
            this.cargando = false;
            /*             setTimeout(() => {
              var evt = new Event('change');
              var elem = document.getElementById(
                'escenarios-select'
              ) as HTMLSelectElement;
              elem.selectedIndex = +this.scenerieId + 1;
              elem.dispatchEvent(evt);
            }, 1000); */
          }
        });

      /* this.cerrarModal(); */
    } else {
      const openButton = document.querySelector('#uniteModalButton');

      if (openButton) {
        (openButton as HTMLElement).click();
        this.cargando = false;
        setTimeout(() => {
          var evt = new Event('change');
          var elem = document.getElementById(
            'escenarios-select'
          ) as HTMLSelectElement;
          elem.selectedIndex = +this.scenerieId + 1;
          elem.dispatchEvent(evt);
        }, 300);
      }
    }
  }

  toggleSwitch(option: boolean) {
    /* this.isConstante = (option === 'constante');*/
    this.constante = option;
  }

  toggleActive(node: any) {
    /*    node.isActive = !node.isActive;
    this.getNumberOfActiveNodes();*/
  }

  nodeInCalculo(id: any) {
    const find = this.calculos.find((calculo: any) => calculo.id == id);
    if (find) {
      return true;
    } else {
      return false;
    }
  }

  saveCursorPosition(element: any) {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const preCaretRange = range.cloneRange();
      preCaretRange.selectNodeContents(element);
      preCaretRange.setEnd(range.endContainer, range.endOffset);
      this.cursorPosition = preCaretRange.toString().length;
    }
  }

  restoreCursorPosition(element: any) {
    const selection = window.getSelection();
    if (selection && element.childNodes.length > 0) {
      const range = document.createRange();
      const textNode = element.childNodes[0];
      const position = Math.min(
        this.cursorPosition,
        textNode.textContent?.length ?? 0
      );
      range.setStart(textNode, position);
      range.setEnd(textNode, position);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
}
