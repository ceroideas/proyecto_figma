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
    },
  ];
  @Output() sendDataEvent = new EventEmitter<any>();
  @Output() editDataEvent = new EventEmitter<any>();
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['editVariable']) {
      this.updateVariables();
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
    console.log(this.editVariable);
    if (this.editVariable) {
      let variable = this.tempObject[this.variableId];
      this.variableName = variable?.name;
      this.variableDescription = variable?.description;
      this.variableUnidad = variable.unidad;
      this.variableSelect1 = variable?.variableSelect1;
      this.variableSelect2 = variable?.variableSelect2;
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
      // Agrega aquí cualquier lógica que desees ejecutar cuando se cierra el modal
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
    console.log(
      this.operation(this.variableSelect1, this.variableSelect2),
      'OPERATION'
    );
    this.sendDataEvent.emit({
      name: this.variableName,
      description: this.variableDescription,
      unidad: this.isOperation
        ? this.operation(this.variableSelect1, this.variableSelect2)
        : this.variableUnidad,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
    });
    this.cerrarModal();
    this.tempObject.push({
      name: this.variableName,
      description: this.variableDescription,
      unidad: this.isOperation
        ? this.operation(this.variableSelect1, this.variableSelect2)
        : this.variableUnidad,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
    });
    console.log(this.variableSelect1, this.variableSelect2);
  }
  editData() {
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
    this.tempObject[this.variableId] = {
      name: this.variableName,
      description: this.variableDescription,
      unidad: this.isOperation
        ? this.operation(this.variableSelect1, this.variableSelect2)
        : this.variableUnidad,
      variableSelect1: this.variableSelect1,
      variableSelect2: this.variableSelect2,
    };
    console.log(this.tempObject);
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
    const unidad1 = this.tempObject[id1 + 1]?.unidad;
    const unidad2 = this.tempObject[id2 + 1]?.unidad;

    // Verificar si las propiedades existen antes de intentar acceder a ellas
    if (unidad1 !== undefined && unidad2 !== undefined) {
      console.log(+unidad1 + +unidad2, 'unidad');
      return +unidad1 + +unidad2;
    } else {
      // Manejar el caso en que alguna de las propiedades es 'undefined'
      return 0;
    }
  }
  updateVariables(): void {
    console.log(this.editVariable);
    if (this.editVariable) {
      let variable = this.tempObject[this.variableId];
      this.variableName = variable?.name;
      this.variableDescription = variable?.description;
      this.variableUnidad = variable.unidad;
      this.variableSelect1 = variable?.variableSelect1;
      this.variableSelect2 = variable?.variableSelect2;
    }
  }
}
