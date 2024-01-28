import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
  inputValues: { [key: string]: string } = {};
  nameProject!: any;
  constructor(private router: Router) {
    this.getYears();
    console.log(this.years);
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

    for (let year = inicialYear; year <= actualYear; year++) {
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
      yearFrom: this.yearFrom,
      yearTo: this.yearTo,
      scenery: this.inputValues,
    };

    this.closeModal();
    this.router.navigate(['home/build'], {
      state: { project },
    });
  }

  closeModal() {
    const closeButton = document.querySelector('#close-modal');

    if (closeButton) {
      (closeButton as HTMLElement).click();
    }
  }
}
