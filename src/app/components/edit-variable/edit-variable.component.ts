import { CommonModule } from '@angular/common';
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
import * as Highcharts from 'highcharts';
import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables);
declare var bootstrap: any;
@Component({
  selector: 'app-edit-variable',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
      unidad: this.variableUnidad,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
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
  calculos: any[] = [];
  disableSend: boolean = true;
  onlyConst: any = [];
  variables: any[] = [
    {
      name: 'variable1',
      scenarys: [
        { name: 'Escenario 1', years: [{ 2020: '800', 2021: '500' }] },
        { name: 'Escenario 2', years: [{ 2020: '700', 2021: '400' }] },
      ],
    },
    {
      name: 'variable2',
      scenarys: [
        { name: 'Escenario 1', years: [{ 2020: '500', 2021: '400' }] },
        { name: 'Escenario 2', years: [{ 2020: '200', 2021: '300' }] },
      ],
    },
    {
      name: 'variable3',
      scenarys: [
        { name: 'Escenario 1', years: [{ 2020: '700', 2021: '200' }] },
        { name: 'Escenario 2', years: [{ 2020: '400', 2021: '100' }] },
      ],
    },
  ];
  operations: any[] = [];
  @Output() sendDataEvent = new EventEmitter<any>();
  @Output() editDataEvent = new EventEmitter<any>();
  @Output() hiddenDataEvent = new EventEmitter<any>();
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

    this.addCalculo();
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
    if (this.editVariable) {
      let variable = this.tempObject[this.variableId];
      this.variableName = variable?.name;
      this.variableDescription = variable?.description;
      this.variableUnidad = variable.unidad;
      this.variableSelect1 = variable?.variableSelect1;
      this.variableSelect2 = variable?.variableSelect2;
      this.isOperation = variable?.operation || false;
    } else {
    }
  }
  ngAfterViewInit() {
    const modal = new bootstrap.Modal(this.miModal.nativeElement);

    modal._element.addEventListener('shown.bs.modal', () => {
      console.log('Modal abierto');
      this.updateVariables();
    });

    modal._element.addEventListener('hidden.bs.modal', () => {
      console.log('Modal cerrado');
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
    });
  }
  editVariableNameClick() {
    this.editVariableName = !this.editVariableName;
  }

  editVariableDescriptionClick() {
    this.editVariableDescription = !this.editVariableDescription;
  }

  sendData() {
    if (this.variableSelect1 && this.variableSelect2) {
      this.isOperation = true;
    }
    let operationType = this.operationType;
    let unidad = this.variableUnidad;
    this.sendDataEvent.emit({
      name: this.variableName,
      description: this.variableDescription,
      unidad: this.isOperation
        ? (() => {
            const unidad1 = this.onlyConst?.[this.variableSelect1]?.unidad;
            const unidad2 = this.onlyConst?.[+this.variableSelect2]?.unidad;

            // Verificar si las propiedades existen antes de intentar acceder a ellas
            if (unidad1 !== undefined && unidad2 !== undefined) {
              switch (this.operationType) {
                case '+':
                  return +unidad1 + +unidad2;

                case '-':
                  return +unidad1 - +unidad2;
                case '*':
                  return +unidad1 * +unidad2;
                case '/':
                  return +unidad1 / +unidad2;
                default:
                  console.error(
                    "Operación no válida. Selecciona '+', '-', '*' o '/' como operationType."
                  );
                  return; // Salir de la función si la operación no es válida
              }
            } else {
              // Manejar el caso en que alguna de las propiedades es 'undefined'
              return 0;
            }
          })()
        : this.variableUnidad,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
    });
    this.cerrarModal();

    let temp = this.onlyConst;

    this.tempObject.push({
      name: this.variableName,
      description: this.variableDescription,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
      operation: !this.constante,
      get unidad(): any {
        const unidad1 = temp?.[+this.variableSelect1]?.unidad;
        const unidad2 = temp?.[+this.variableSelect2]?.unidad;
        console.log(unidad1, unidad2, this.operation, 'dsjhjduhd');
        // Verificar si las propiedades existen antes de intentar acceder a ellas
        if (
          unidad1 !== undefined &&
          unidad2 !== undefined &&
          this.operation === true
        ) {
          switch (operationType) {
            case '+':
              return +unidad1 + +unidad2;

            case '-':
              return +unidad1 - +unidad2;
            case '*':
              return +unidad1 * +unidad2;
            case '/':
              return +unidad1 / +unidad2;
            default:
              console.error(
                "Operación no válida. Selecciona '+', '-', '*' o '/' como operationType."
              );
              return; // Salir de la función si la operación no es válida
          }
        } else {
          // Manejar el caso en que alguna de las propiedades es 'undefined'
          return unidad;
        }
      },
    });
  }
  editData() {
    if (this.variableSelect1 && this.variableSelect2) {
      this.isOperation = true;
    }
    let operationType = this.operationType;
    let unidad = this.variableUnidad;
    this.editDataEvent.emit({
      name: this.variableName,
      description: this.variableDescription,
      unidad: this.isOperation
        ? this.operation(this.variableSelect1, this.variableSelect2)
        : this.variableUnidad,
      fatherNode: this.variableFather,
      nameNode: this.variableId,
    });
    this.cerrarModal();
    let temp = this.tempObject;
    this.tempObject[this.variableId] = {
      name: this.variableName,
      description: this.variableDescription,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
      operation: !this.constante,
      get unidad(): any {
        const unidad1 = temp?.[+this.variableSelect1 + 1]?.unidad;
        const unidad2 = temp?.[+this.variableSelect2 + 1]?.unidad;
        console.log(unidad1, unidad2, this.operation);
        // Verificar si las propiedades existen antes de intentar acceder a ellas
        if (
          unidad1 !== undefined &&
          unidad2 !== undefined &&
          this.operation === true
        ) {
          switch (operationType) {
            case '+':
              return +unidad1 + +unidad2;

            case '-':
              return +unidad1 - +unidad2;
            case '*':
              return +unidad1 * +unidad2;
            case '/':
              return +unidad1 / +unidad2;
            default:
              console.error(
                "Operación no válida. Selecciona '+', '-', '*' o '/' como operationType."
              );
              return; // Salir de la función si la operación no es válida
          }
        } else {
          // Manejar el caso en que alguna de las propiedades es 'undefined'
          return unidad;
        }
      },
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
      this.editData();
    } else {
      this.sendData();
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
      let variable = this.tempObject[this.variableId];
      this.variableName = variable?.name;
      this.variableDescription = variable?.description;
      this.variableUnidad = variable.unidad;
      this.variableSelect1 = variable?.variableSelect1;
      this.variableSelect2 = variable?.variableSelect2;
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
  openUniteModal() {
    console.log('open ');
  }

  addVariable(variable: any) {
    this.calculos.push({ name: variable.name });
    this.operations.push(variable.scenarys);
    console.log(this.operations);
  }
  addCalculo() {
    type YearValue = {
      [key: number]: string;
    };

    type Scenario = {
      name: string;
      years: YearValue[];
    };

    const escenarios: Scenario[][] = [
      [
        { name: 'Escenario 1', years: [{ 2020: '800', 2021: '500' }] },
        { name: 'Escenario 2', years: [{ 2020: '700', 2021: '400' }] },
      ],
      [
        { name: 'Escenario 1', years: [{ 2020: '800', 2021: '500' }] },
        { name: 'Escenario 2', years: [{ 2020: '700', 2021: '400' }] },
      ],
      [
        { name: 'Escenario 1', years: [{ 2020: '700', 2021: '200' }] },
        { name: 'Escenario 2', years: [{ 2020: '400', 2021: '100' }] },
      ],
    ];
    let newEscenario: any = [];

    const allYears: number[] = Array.from(
      new Set(
        escenarios
          .flat()
          .flatMap((escenario) => Object.keys(escenario.years[0]).map(Number))
      )
    );
    for (let i = 0; i < escenarios.length; i++) {
      const element = escenarios[i];
      for (let i = 0; i < element.length; i++) {
        const element2 = element[i];
        const escenarioExiste = newEscenario.some(
          (objeto: any) => objeto.name === element2.name
        );
        if (!escenarioExiste) {
          newEscenario.push({ name: element2.name, years: element2.years });
        } else {
          const objetoConNombre = newEscenario.find(
            (obj: any) => obj.name === element2.name
          );
          objetoConNombre.years.forEach((year: any) => {
            Object.entries(year).forEach(([clave, valor]) => {
              /* year[clave] = parseInt(valor as string) + element2.years[0][year]; */
              objetoConNombre.years[0][clave] =
                parseInt(valor as string) + +element2.years[0][clave as any];
              console.log(
                parseInt(valor as string),
                +element2.years[0][clave as any],
                'a suma2'
              );
            });
          });
        }
      }
    }

    console.log(newEscenario);

    /*     const nuevosEscenarios: Scenario[] = escenarios[0].map(({ name }) => {
      const nuevoYears: YearValue[] = allYears.map((anio) => {
        const suma = escenarios.reduce((total, escenario) => {
          const escenarioActual = escenario.find((s) => s.name === name);
          if (escenarioActual) {
            const valor = parseInt(
              escenarioActual.years.find(
                (y) => parseInt(Object.keys(y)[0]) === anio
              )?.[anio] || '0'
            );
            return total + valor;
          }
          return total;
        }, 0);
        return { [anio]: suma.toString() };
      });

      return { name, years: nuevoYears };
    }); */
  }
}
