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
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Chart, registerables } from 'node_modules/chart.js';
import { DataService } from 'src/app/services/data-service.service';
import { ProjectService } from 'src/app/services/project.service';
import { EventsService } from 'src/app/services/events.service';
import Swal from 'sweetalert2';
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
  @Input() variableFather: any;
  @Input() editVariable: boolean = false;
  @Input() aux: any;
  @Input() tier: any;
  @ViewChild('exampleModal') miModal!: ElementRef;
  editVariableName: boolean = false;
  editVariableDescription: boolean = false;
  editVariableUnidad: boolean = false;
  variableOperation: any;
  mean: number = 0;
  rate: number = 0;
  min: number = 0;
  max: number = 0;
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
  constructor(
    private projectSvc: ProjectService,
    private dataService: DataService,
    private ngZone: NgZone,
    public events: EventsService,
    private elementRef: ElementRef
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
    /*     setTimeout(() => {
      new Chart('myChart', {
        type: 'bar',

        data: {
          labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
          datasets: [
            {
              backgroundColor: '#8C64B1',
              label: '# of Votes',
              data: [12, 19, 3, 5, 2, 3],
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }, 1000); */
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
    console.log('Guardando:', this.inputValue);
    // Aquí puedes implementar la lógica para guardar los datos
    // por ejemplo, puedes hacer una llamada a una API
    this.mostrarPopover = false; // Oculta el popover después de guardar
  }

  cerrarPopover(event: MouseEvent) {
    if (this.closeToogle) {
      this.mostrarPopover = false;
      this.closeToogle = false;
    }
  }

  // @HostListener('document:click', ['$event'])
  // onClick(event: MouseEvent) {
  //   this.cerrarPopover(event);
  // }

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
          console.log(chartName);
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
    console.log(
      {
        name: this.variableName,
        description: this.variableDescription,
        operation: !this.constante,
        constante: this.constante,
        formula: this.sendOperations,
        unite: this.variableUnidad,
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
      },
      'DATA SENDIADA'
    );
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
      unite: this.variableUnidad,
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

  submit() {
    if (this.editVariable) {
      if (this.disable()) {
        Swal.fire({
          title: 'Error',
          text: 'The name and description are required.',
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
          text: 'The name and description are required.',
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

    if (this.editVariable) {
      this.cargando = true;
      this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
        this.variableUnidad = res.unite ? res.unite : undefined;

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
            : 'ANormal';

          if (this.chart) {
            this.chart.destroy();
          }
          console.log(chartName);

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

    this.calculos.push(variable.name);
    const variableTo =
      variable.type === 2 ? variable.calculated : variable.sceneries;
    this.operations.push(variableTo);

    this.calculos[this.calculos.length - 1];

    this.operationResult();
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

  addCalculo(operation: string) {
    // if (this.sendOperations.length > 0) {
    this.calculos.push(operation);
    this.operations.push([{ name: operation }]);

    this.sendOperations.push(operation);
    // }

    this.operationResult();
  }

  addCustom() {
    if (this.inputValue.toString().includes('%')) {
      const valueBase = parseFloat(this.inputValue.toString().replace('%', ''));

      this.inputValue = (+valueBase / 100).toString();
    }

    this.calculos.push(this.inputValue);
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
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: ['-', '-', '-', '-', '-'],
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: 'Normal',
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

  triangularChart() {
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: ['-', '-', '-'],
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: 'Triangular',
            data: [1, 100, 1], // Modifica los datos para que tengan forma triangular
            fill: true,
          },
        ],
      },
      options: {
        plugins: {},
        scales: {
          y: {},
        },
      },
    });
  }

  poissonChart() {
    // Función para calcular la distribución de Poisson
    function poisson(k: any, lambda: any) {
      return (Math.exp(-lambda) * Math.pow(lambda, k)) / factorial(k);
    }

    // Función para calcular el factorial
    function factorial(n: any) {
      let result = 1;
      for (let i = 2; i <= n; i++) {
        result *= i;
      }
      return result;
    }

    // Parámetros para la distribución de Poisson
    const lambda = 5; // Parámetro lambda de la distribución de Poisson
    const maxK = 10; // Valor máximo de k

    // Generar los datos para la distribución de Poisson
    const dataPoisson = [];
    for (let k = 0; k <= maxK; k++) {
      dataPoisson.push(poisson(k, lambda));
    }

    // Crear el gráfico de líneas con la distribución de Poisson
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: Array.from({ length: maxK + 1 }, (_, i) => ''),
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: 'Poisson',
            data: dataPoisson,
          },
        ],
      },
      options: {
        plugins: {},
        scales: {
          x: {
            display: false, // Oculta las etiquetas del eje x
          },
          y: {},
        },
      },
    });
  }

  binomialChart() {
    // Valores aproximados para representar una distribución binomial
    const dataBinomial = [
      1, 0, 0, 2, 3, 1, 7, 9, 17, 31, 49, 69, 94, 119, 128, 141, 104, 79, 60,
      46, 20, 14, 1, 4, 0, 1,
    ]; // Ejemplo de valores aproximados

    // Crear el gráfico de barras con la distribución binomial
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: Array.from({ length: dataBinomial.length }, () => ''),
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: 'Binomial',
            data: dataBinomial,
          },
        ],
      },
      options: {
        plugins: {},
        scales: {
          x: { display: false }, // Oculta las etiquetas del eje x
        },
      },
    });
  }

  weibullChart() {
    // Tus códigos
    var a = 5; // shape
    var form = 1;
    var s = Array.from({ length: 1000 }, () =>
      Math.pow(-Math.log(Math.random()), form / a)
    );

    // Función weibull
    function weib(x: number, n: number, a: number) {
      return (a / n) * Math.pow(x / n, a - 1) * Math.exp(-Math.pow(x / n, a));
    }

    // Crear la gráfica

    var x = Array.from({ length: 100 }, (_, i) => (i + 1) / 50);
    var y = x.map((val) => weib(val, form, a));
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: x,
        datasets: [
          {
            label: 'Weibull Distribution',
            data: y,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
          x: {
            display: false,
          },
        },
      },
    });

    console.log(s, 'ido');
  }

  lognormalChart() {
    // Parámetros de la distribución logarítmico normal
    const mu = Math.log(70); // Media logarítmica
    const sigma = 12 / 70; // Desviación estándar logarítmica

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
        labels.push(x.toFixed(2));
        data.push(pdf);
      }
    }
    console.log(data);
    // Configuración del gráfico

    // Crear gráfico

    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Distribución Logarítmico Normal',
            data: data,
            backgroundColor: '#8C64B1',
            borderColor: '#8C64B1',
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          x: {
            display: false,
            title: {
              display: false,
              text: 'Valor',
            },
            ticks: {
              stepSize: 20, // Mostrar cada 20 puntos en el eje x
            },
          },
          y: {
            title: {
              display: false,
              text: 'Densidad de probabilidad',
            },
          },
        },
      },
    });
  }

  betaChart() {
    // Parámetros de la distribución beta
    const alpha = 10; // Parámetro de forma
    const beta = 2; // Parámetro de forma
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
          label: 'Distribución Beta',
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
      pdfData.labels.push(i.toFixed(2)); // Redondeamos para evitar números largos
      pdfData.datasets[0].data.push(betaPDF(i, alpha, beta));
    }

    // Configurar opciones del gráfico
    const options = {
      scales: {
        x: {
          title: {
            display: false,
            text: 'Valor',
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

    // Ajustar las opciones del eje y para el histograma
  }

  hypergeometricChart() {
    // Parámetros de la distribución hipergeométrica
    const M = 40; // Tamaño de la población
    const n = 30; // Número de éxitos en la población
    const N = 20; // Tamaño de la muestra

    // Generar muestras de la distribución hipergeométrica
    const samples = Array.from({ length: 1000 }, () => {
      let successCount = 0;
      for (let i = 0; i < N; i++) {
        if (Math.random() < n / M) {
          successCount++;
        }
      }
      return successCount;
    });

    // Calcular el histograma de las muestras generadas
    const bins = Array.from(new Set(samples)).sort((a, b) => a - b);
    const histogramData = bins.map(
      (bin) => samples.filter((value) => value === bin).length / samples.length
    );

    // Configurar los datos para el gráfico
    const data = {
      labels: bins,
      datasets: [
        {
          label: 'Distribución Hipergeométrica',
          data: histogramData,
          backgroundColor: '#8C64B1',
          borderColor: '#8C64B1',
          borderWidth: 1,
        },
      ],
    };

    // Configurar opciones del gráfico
    const options = {
      scales: {
        x: {
          display: false,
        },
        y: {
          title: {
            display: true,
            text: 'Densidad de probabilidad',
          },
        },
      },
    };

    // Crear el gráfico de barras usando Chart.js

    this.chart = new Chart('myChart', {
      type: 'bar',
      data: data,
      options: options,
    });
  }

  geometricChart() {
    // Valores aproximados para representar una distribución binomial
    const dataBinomial = [
      0.0967, 0.0886, 0.0818, 0.0729, 0.0689, 0.0615, 0.0486, 0.0476, 0.0439,
      0.0389, 0.0352, 0.0321, 0.0314, 0.028, 0.021, 0.0198, 0.0194, 0.0173,
      0.013, 0.0144, 0.0132, 0.0087, 0.0091, 0.0088, 0.0062, 0.0074, 0.0067,
      0.0049, 0.0049, 0.0042, 0.005, 0.0039, 0.0035, 0.0037, 0.0034, 0.003,
      0.003, 0.0012, 0.0021, 0.0013, 0.001, 0.0014, 0.0013, 0.0008, 0.0011,
      0.0011, 0.0011, 0.0006, 0.0005, 0.0005, 0.0005, 0.0008, 0.0003, 0.0004,
      0.0004, 0.0005, 0.0006, 0.0004, 0.0001, 0.0002, 0.0001, 0.0001, 0.0001,
      0.0001, 0.0002, 0.0002, 0.0001, 0.0001, 0.0001, 0.0001,
    ]; // Ejemplo de valores aproximados

    // Crear el gráfico de barras con la distribución binomial
    this.chart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: Array.from({ length: dataBinomial.length }, () => ''),
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: 'Geometric',
            data: dataBinomial,
          },
        ],
      },
      options: {
        plugins: {},
        scales: {
          x: { display: false }, // Oculta las etiquetas del eje x
        },
      },
    });
  }

  uniformChart() {
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: ['-', '-', '-', '-', '-'],
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: 'Uniforme',
            data: [19, 19, 19, 19, 19],
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

  exponentialChart() {
    this.chart = new Chart('myChart', {
      type: 'line',
      data: {
        labels: ['-', '-', '-', '-', '-'],
        datasets: [
          {
            backgroundColor: '#8C64B1',
            label: 'Exponencial',
            data: [19, 12, 7, 2, 0],
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

  deleteShapeData() {
    localStorage.removeItem('shapeData');
    localStorage.removeItem('shapetype');

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
    this.mean = 0;
    this.rate = 0;
  }

  saveNewValue() {
    this.events.publish('changeEditUnite', this.variableUnidad);
  }

  removeStorage() {
    localStorage.removeItem('shapeData');
    localStorage.removeItem('shapetype');
  }

  setEvent() {
    setTimeout(() => {
      var evt = new Event('change');
      var elem = document.getElementById(
        'escenarios-select'
      ) as HTMLSelectElement;
      elem.selectedIndex = 1;
      elem.dispatchEvent(evt);
    }, 100);
  }
}
