import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

  constructor() {
    this.getYears();
    console.log(this.years);
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
}
