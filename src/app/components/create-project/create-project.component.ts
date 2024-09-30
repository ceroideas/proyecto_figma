import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
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
export class CreateProjectComponent implements AfterViewInit {
  project_edit: any;
  years: number[] = [];
  yearFrom: any = '#';
  yearDefault: any = '#';
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

  growthPercentage: number = 0;
  percentageError: boolean = false;
  yearsDefault: number[] = [];
  growth: boolean = false;

  selectNumber: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  selectedNumber: any = '#';

  constructor(private router: Router, private projectSvc: ProjectService) {
    this.getYears();
  }

  addInput() {
    /*     this.inputs = [];
    this.inputValues = {}; */
    if (this.inputs.length > this.selectedNumber) {
      this.inputs.splice(this.selectedNumber);
      const keys = Object.keys(this.inputValues).slice(0, this.selectedNumber);
      this.inputValues = keys.reduce((acc: any, key: any) => {
        acc[key] = this.inputValues[key];
        return acc;
      }, {});
      console.log(this.inputValues);
    } else if (this.inputs.length > 0) {
      this.inputs = [];
      for (var i = 0; i < this.selectedNumber; ++i) {
        const inputKey = `scenary-${i}`;
        this.inputs.push(inputKey);
        this.inputValues[inputKey] = this.inputValues[inputKey] ?? '';
      }
    }
  }
  deleteInput(index: any) {
    this.selectedNumber = +this.selectedNumber - 1;
    const entries = Object.entries(this.inputValues);
    const filteredEntries = entries.filter(
      ([key, value]) => key !== `scenary-${index}`
    );
    this.inputValues = {};
    filteredEntries.forEach(([key, value], index) => {
      this.inputValues[`scenary-${index}`] = value;
    });

    this.inputs = [];
    for (var i = 0; i < this.selectedNumber; ++i) {
      const inputKey = `scenary-${i}`;
      this.inputs.push(inputKey);
      this.inputValues[inputKey] = this.inputValues[inputKey] ?? '';
    }

    console.log(this.inputs, this.inputValues);
  }

  addInputToEdit(sceneries: any[]) {
    this.inputs = [];
    this.inputValues = {};

    for (var i = 0; i < sceneries.length; ++i) {
      const name = sceneries[i];
      console.log(name, 'name');
      const inputKey = `scenary-${i}`;
      this.inputs.push(inputKey);
      this.inputValues[inputKey] = name; // Inicializa el valor del nuevo input
    }
  }

  removeInput() {
    if (this.inputCount > 0) {
      const removedInputKey = this.inputs.pop() || 0;
      delete this.inputValues[removedInputKey];
      this.inputCount--;
    }
  }

  ngAfterViewInit() {
    const modalElement = document.getElementById('createProjectModal');

    if (modalElement) {
      // Detectar cuando el modal se abre

      modalElement.addEventListener('shown.bs.modal', () => {
        if (this.project_edit) {
          console.log(this.project_edit);
          this.nameProject = this.project_edit.name;
          this.yearFrom = this.project_edit.year_from;
          this.yearTo = this.project_edit.year_to;
          this.onFromSelected(this.yearFrom);
          this.addInputToEdit(this.project_edit.sceneries);
          this.yearDefault = this.project_edit.default_year;
          this.selectColor(this.project_edit.line_color);
          this.growthPercentage = this.project_edit.default_growth_percentage;
          this.selectedNumber = this.project_edit.sceneries.length;
        }
      });

      // Detectar cuando el modal se cierra
      modalElement.addEventListener('hidden.bs.modal', () => {
        console.log('El modal se ha cerrado');
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['project_edit']) {
      console.log(
        'project_edit ha cambiado:',
        changes['project_edit'].currentValue
      );
      // Aquí puedes manejar cualquier lógica cuando project_edit cambie
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
    this.yearDefault =
      this.yearFrom > this.yearDefault ? this.yearFrom : this.yearDefault;
    this.yearsTo = this.years.filter((year) => year >= this.yearFrom);
    this.yearTo = this.yearsTo.includes(this.yearTo)
      ? this.yearTo
      : this.yearsTo[0];

    this.defaultYear();
  }

  defaultYear() {
    console.log(this.yearFrom, this.yearTo, 'ASD');

    this.yearsDefault = [];
    if (this.yearFrom && this.yearTo) {
      for (let year = +this.yearFrom; year <= +this.yearTo; year++) {
        if (year > this.years[this.years.length - 1]) break;
        this.yearsDefault.push(year);
      }
      console.log(this.yearsDefault, 'ASD');
    }

    if (this.yearsDefault.length < 1) this.yearDefault = '#';
    if (this.yearsDefault.length == 1) this.yearDefault = this.yearsDefault[0];
  }

  createProject() {
    const allValuesNonEmpty = (object: any) => {
      return Object.values(object).every(
        (value) => value !== '' && value !== null && value !== undefined
      );
    };

    const project = {
      name: this.nameProject,
      year_from: this.yearFrom,
      year_to: this.yearTo,
      default_year: this.yearDefault,
      default_growth: this.growth,
      default_growth_percentage: this.growthPercentage,
      sceneries: Object.values(this.inputValues),
      line_color: this.colorBar,
    };
    console.log(project);
    console.log(this.inputValues, 'VALUE');

    if (
      this.nameProject === '' ||
      this.yearFrom === '#' ||
      this.yearTo === '#' ||
      this.yearDefault === '#' ||
      !allValuesNonEmpty(this.inputValues)
    ) {
      Swal.fire({
        title: 'Error',
        text: 'The name, scenario and years are required.',
        icon: 'error',
        iconColor: '#BC5800',
        customClass: {
          confirmButton: 'confirm',
          cancelButton: 'cancel',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const openButton = document.querySelector('#createProjectModal');

          if (openButton) {
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
    } else if (this.growth == true && this.growthPercentage <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'You must fill in the growth percentage.',
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

    this.router.navigate(['home/build'], { queryParams: project });
  }

  editProject() {
    const allValuesNonEmpty = (object: any) => {
      return Object.values(object).every(
        (value) => value !== '' && value !== null && value !== undefined
      );
    };

    const project = {
      name: this.nameProject,
      year_from: this.yearFrom,
      year_to: this.yearTo,
      default_year: this.yearDefault,
      default_growth: this.growth,
      default_growth_percentage: this.growthPercentage,
      sceneries: Object.values(this.inputValues),
      line_color: this.colorBar,
    };
    console.log(project);
    console.log(this.inputValues, 'VALUE');

    /*     if (
      this.nameProject === '' ||
      this.yearFrom === '#' ||
      this.yearTo === '#' ||
      this.yearDefault === '#' ||
      !allValuesNonEmpty(this.inputValues)
    ) {
      Swal.fire({
        title: 'Error',
        text: 'The name, scenario and years are required.',
        icon: 'error',
        iconColor: '#BC5800',
        customClass: {
          confirmButton: 'confirm',
          cancelButton: 'cancel',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          const openButton = document.querySelector('#createProjectModal');

          if (openButton) {
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
    } else if (this.growth == true && this.growthPercentage <= 0) {
      Swal.fire({
        title: 'Error',
        text: 'You must fill in the growth percentage.',
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

    this.router.navigate(['home/build'], { queryParams: project }); */
  }

  closeModal() {
    const closeButton = document.querySelector('#close-modal');

    if (closeButton) {
      (closeButton as HTMLElement).click();
    }
  }

  selectColor(color: string) {
    this.colorBar = color;
  }

  validatePercentage() {
    if (this.growthPercentage < 0) {
      this.growthPercentage = 0;
      this.percentageError = true;
    } else if (this.growthPercentage > 100) {
      this.growthPercentage = 100;
      this.percentageError = true;
    } else {
      this.percentageError = false;
    }
  }

  resetProjectyId() {
    this.project_edit = null;
  }
}
