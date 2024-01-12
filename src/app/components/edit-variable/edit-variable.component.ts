import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as Highcharts from 'highcharts';
import { Chart, registerables } from 'node_modules/chart.js';
Chart.register(...registerables);
@Component({
  selector: 'app-edit-variable',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-variable.component.html',
  styleUrl: './edit-variable.component.scss',
})
export class EditVariableComponent implements OnInit {
  @Input() variableId: any;
  @Input() variableFather: any;
  @Input() editVariable: boolean = false;
  editVariableName: boolean = false;
  editVariableDescription: boolean = false;
  variableName: any = 'Nombre variable ';
  variableDescription: any =
    'Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Velit officia consequat duis enim velit mollit. Exercitationveniam consequat sunt nostrud amet.';
  tempObject = [
    {},
    { name: this.variableName, description: this.variableDescription },
  ];
  @Output() sendDataEvent = new EventEmitter<any>();
  @Output() editDataEvent = new EventEmitter<any>();
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
    }
  }

  editVariableNameClick() {
    this.editVariableName = !this.editVariableName;
  }

  editVariableDescriptionClick() {
    this.editVariableDescription = !this.editVariableDescription;
  }

  sendData() {
    this.sendDataEvent.emit({
      name: this.variableName,
      description: this.variableDescription,
    });
    this.cerrarModal();
    this.tempObject.push({
      name: this.variableName,
      description: this.variableDescription,
    });
  }
  editData() {
    this.editDataEvent.emit({
      name: this.variableName,
      description: this.variableDescription,
      fatherNode: this.variableFather,
      nameNode: this.variableId,
    });
    this.cerrarModal();
    this.tempObject[this.variableId] = {
      name: this.variableName,
      description: this.variableDescription,
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
}
