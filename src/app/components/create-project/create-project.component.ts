import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-create-project',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],

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
  constructor(private router: Router, private projectSvc: ProjectService) {
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
      year_from: this.yearFrom,
      year_to: this.yearTo,
      sceneries: Object.values(this.inputValues),
    };

    this.closeModal();
    /*     this.projectSvc.saveProject(project).subscribe((res) => {
      console.log(res);
    }); */
    /* this.router.navigate(['home/build'], { queryParams: project }); */
  }

  closeModal() {
    const closeButton = document.querySelector('#close-modal');

    if (closeButton) {
      (closeButton as HTMLElement).click();
    }
  }
}
