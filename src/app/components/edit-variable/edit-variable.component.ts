import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Chart, registerables } from 'node_modules/chart.js';
import { DataService } from 'src/app/services/data-service.service';
import { ProjectService } from 'src/app/services/project.service';
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
  variableSelect1: any = '#';
  variableSelect2: any = '#';
  variableUnidad!: any;
  isOperation: boolean = false;
  constante: boolean = true;
  variableName!: any;
  @Input() isHidden: boolean = false;
  variableDescription!: any;
  operationType: any = '+';
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
  showNewEscenario: any[] = [];
  operations: any[] = [];
  sendOperations: any[] = [];
  selectedCalculo: any;
  oldType!: boolean;
  @Output() sendDataEvent = new EventEmitter<any>();

  @Output() deleteDataEvent = new EventEmitter<any>();
  @Output() deleteNode = new EventEmitter<any>();
  @Output() editDataEvent = new EventEmitter<any>();
  @Output() hiddenDataEvent = new EventEmitter<any>();
  constructor(
    private projectSvc: ProjectService,
    private dataService: DataService
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
    setTimeout(() => {
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
    }, 1000);

    this.projectSvc.getProject(this.projectId).subscribe((res: any) => {
      console.log(res.nodes, 'RES');
      this.variables = res.node;
    });

    if (this.editVariable) {
      let variable = this.tempObject[this.variableId];
      this.variableName = variable?.name;
      this.variableDescription = variable?.description;
    } else {
    }
  }

  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', async () => {
      this.updateVariables();
      this.projectSvc.getProject(this.projectId).subscribe((res: any) => {
        this.variables = res.nodes;
      });
    });

    modal._element.addEventListener('hidden.bs.modal', () => {
      if (!this.editVariable) {
        this.variableSelect1 = '';
        this.variableSelect2 = '';

        this.variableUnidad = 0;
        this.editVariableName = false;
        this.editVariableDescription = false;
        this.editVariableUnidad = false;
        this.isOperation = false;
        this.constante = true;
        this.calculos = [];
        this.sendOperations = [];
        this.showNewEscenario = [];
      } else {
        this.variableName = '';
        this.variableSelect1 = '';
        this.variableSelect2 = '';
        this.variableDescription = '';
        this.variableUnidad = 0;
        this.editVariableName = false;
        this.editVariableDescription = false;
        this.editVariableUnidad = false;
        this.isOperation = false;
        this.constante = true;
        this.calculos = [];
        this.sendOperations = [];
        this.showNewEscenario = [];
      }
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
      constante: this.constante,
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
          text: 'El nombre y la descripción son necesarios.',
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
      }
    } else {
      if (this.disable()) {
        Swal.fire({
          title: 'Error',
          text: 'El nombre y la descripcion son necesarios.',
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
    if (this.editVariable) {
      this.projectSvc.getNode(this.nodeId).subscribe((res: any) => {
        console.log(res);
        this.constante = res.type === 1 ? true : false;
        this.oldType = res.type === 1 ? true : false;
        this.variableName = res.name;
        this.variableDescription = res.description;
        this.calculos = res.new_formula ? res.new_formula : [];
        this.sendOperations = res.formula ? res.formula : [];
        this.showNewEscenario = res.calculated ? res.calculated : [];
      });
    }
  }
  hiddenData() {
    this.hiddenDataEvent.emit();
  }
  disable() {
    if (this.variableName && this.variableDescription) {
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
    console.log(this.sendOperations, 'smkdnm');
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

    console.log(newEscenario, 'escenario');
    this.showNewEscenario = newEscenario;
  }

  addCalculo(operation: string) {
    if (this.operations.length > 0) {
      this.calculos.push(operation);
      this.operations.push([{ name: operation }]);

      this.sendOperations.push(operation);
      console.log(this.operations);
    }
    console.log(this.sendOperations, 'kdjodjn');
    this.operationResult();
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
    console.log(this.sendOperations);
  }
  submitEdit() {
    const editVariable = {
      name: this.variableName,
      description: this.variableDescription,
      formula: this.sendOperations,
    };
    console.log(editVariable, 'edit');
    this.projectSvc
      .updateNode(this.nodeId, editVariable)
      .subscribe((res: any) => {});
  }

  elimateNode() {
    Swal.fire({
      title: 'Estas seguro?',
      text: 'No podras revertir esta accion',
      icon: 'question',
      iconColor: '#BC5800',
      showCancelButton: true,
      confirmButtonText: 'Si, borrar',
      customClass: {
        confirmButton: 'confirm',
        cancelButton: 'cancel',
      },
    }).then((result) => {
      if (result.isConfirmed) {
        this.projectSvc.deleteNode(this.nodeId).subscribe((res: any) => {
          this.deleteNode.emit();
          Swal.fire({
            title: 'Borrado!',
            text: 'El nodo fue borrado con exito!',
            icon: 'success',
          });
        });
      }
    });
  }

  verifyType() {
    if (this.editVariable) {
      setTimeout(() => {
        if (this.oldType !== this.constante) {
          Swal.fire({
            title: 'Estas seguro?',
            text: 'Si cambias el tipo los datos asociados se perderan',
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
}
