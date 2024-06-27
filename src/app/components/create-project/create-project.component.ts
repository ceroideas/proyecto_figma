import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  providers: [ProjectService],
  templateUrl: './create-project.component.html',
  styleUrl: './create-project.component.scss',
})
export class CreateProjectComponent {
  years: number[] = [];
  yearFrom: any = '#';
  yearTo: any = '#';
  yearsTo: number[] = [];
  inputCount: number = 0;
  inputs: string[] = [];
  @Output() createProjectEvent = new EventEmitter<any>();
  inputValues: { [key: string]: string } = {};
  nameProject!: any;
  colorBar: any = '140, 100, 177';
  colorsOption: any[] = [
    '140, 100, 177',
    '108, 117, 125',
    '255, 193, 7',
    '0, 123, 255',
    '220, 53, 69',
    '23, 162, 184',
    '40, 167, 69 ',
  ];

  percentage!: number;
  percentageError: boolean = false;


  constructor(private router: Router, private projectSvc: ProjectService) {
    this.getYears();
  }

  addInput() {
    this.inputCount++;
    const inputKey = `scenary-${this.inputCount}`;
    this.inputs.push(inputKey);
    this.inputValues[inputKey] = ''; // Inicializa el valor del nuevo input
  }

  removeInput() {
    if (this.inputCount > 0) {
      const removedInputKey = this.inputs.pop() || 0;
      delete this.inputValues[removedInputKey];
      this.inputCount--;
    }
  }

  getYears() {
    const actualYear = new Date().getFullYear();
    const inicialYear = 2000;
    const yearsToAdd = 5;

    for (let year = inicialYear; year <= actualYear + yearsToAdd; year++) {
      this.years.push(year);
    }
    this.yearsTo = [...this.years];
  }

  onFromSelected(from: number) {
    this.yearsTo = this.years.filter((year) => year > from);
  }

  createProject() {
    const project = {
      name: this.nameProject,
      year_from: this.yearFrom,
      year_to: this.yearTo,
      sceneries: Object.values(this.inputValues),
    };
    console.log(project);

    if (
      this.nameProject === '' ||
      this.yearFrom === '#' ||
      this.yearTo === '#'
    ) {
      Swal.fire({
        title: 'Error',
        text: 'The name and years are required.',
        icon: 'error',
        iconColor: '#BC5800',
        customClass: {
          confirmButton: 'confirm',
          cancelButton: 'cancel',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const openButton = document.querySelector('#createProjectModal');

          // Verifica si el botón existe antes de intentar cerrar el modal
          if (openButton) {
            // Simula un clic en el botón para cerrar el modal
            (openButton as HTMLElement).click();
          }
        }
      });
    } else if (project.sceneries.length <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'You must create at least one scenario.',
        icon: 'error',
        iconColor: '#BC5800',
        customClass: {
          confirmButton: 'confirm',
          cancelButton: 'cancel',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const openButton = document.querySelector('#createProjectModal');

          // Verifica si el botón existe antes de intentar cerrar el modal
          if (openButton) {
            // Simula un clic en el botón para cerrar el modal
            (openButton as HTMLElement).click();
          }
        }
      });
    } else {
      this.closeModal();
      this.projectSvc.saveProject(project).subscribe((res) => {
        this.createProjectEvent.emit();
      });
    }

    /* this.router.navigate(['home/build'], { queryParams: project }); */
  }

  closeModal() {
    const closeButton = document.querySelector('#close-modal');

    if (closeButton) {
      (closeButton as HTMLElement).click();
    }
  }


    selectColor(color: string, event: any) {
      this.colorBar = color;
  }

    validatePercentage() {
    if (this.percentage < 0) {
      this.percentage = 0;
      this.percentageError = true;
    } else if (this.percentage > 100) {
      this.percentage = 100;
      this.percentageError = true;
    } else {
      this.percentageError = false;
    }
  }
}
