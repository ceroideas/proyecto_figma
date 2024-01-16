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
  @ViewChild('exampleModal') miModal!: ElementRef;
  editVariableName: boolean = false;
  editVariableDescription: boolean = false;
  editVariableUnidad: boolean = false;
  variableOperation: any;
  variableSelect1!: any;
  variableSelect2!: any;
  variableUnidad!: any;
  isOperation: boolean = false;
  variableName: any = 'Nombre variable ';
  @Input() isHidden: boolean = false;
  variableDescription: any =
    'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitationveniam consequat sunt nostrud amet.';
  tempObject = [
    {},
    {
      name: this.variableName,
      description: this.variableDescription,
      unidad: 200,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
      operation: false,
    },
  ];
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
  }

  ngOnInit(): void {
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
    let unidad = this.variableUnidad;
    this.sendDataEvent.emit({
      name: this.variableName,
      description: this.variableDescription,
      unidad: this.isOperation
        ? (() => {
            const unidad1 = this.tempObject?.[this.variableSelect1 + 1]?.unidad;
            const unidad2 =
              this.tempObject?.[+this.variableSelect2 + 1]?.unidad;

            // Verificar si las propiedades existen antes de intentar acceder a ellas
            if (unidad1 !== undefined && unidad2 !== undefined) {
              return +unidad1 + +unidad2;
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
    /*     this.tempObject.push({
      name: this.variableName,
      description: this.variableDescription,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
      get unidad():any {
        
        const unidad1 = tempObject?.[this.variableSelect1 + 1]?.unidad;
        const unidad2 =
          this.tempObject?.[+this.variableSelect2 + 1]?.unidad;

        // Verificar si las propiedades existen antes de intentar acceder a ellas
        if (unidad1 !== undefined && unidad2 !== undefined) {
          return +unidad1 + +unidad2;
        } else {
          // Manejar el caso en que alguna de las propiedades es 'undefined'
          return 0;
        }
      },

    }); */
    let temp = this.tempObject;

    this.tempObject.push({
      name: this.variableName,
      description: this.variableDescription,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
      operation: this.isOperation,
      get unidad(): any {
        const unidad1 = temp?.[+this.variableSelect1 + 1]?.unidad;
        const unidad2 = temp?.[+this.variableSelect2 + 1]?.unidad;
        console.log(unidad1, unidad2, this.operation, 'dsjhjduhd');
        // Verificar si las propiedades existen antes de intentar acceder a ellas
        if (
          unidad1 !== undefined &&
          unidad2 !== undefined &&
          this.operation === true
        ) {
          return +unidad1 + +unidad2;
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
      operation: this.isOperation,
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
          return +unidad1 + +unidad2;
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
    const unidad1 = this.tempObject[+id1 + 1]?.unidad;
    const unidad2 = this.tempObject[+id2 + 1]?.unidad;

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
}
