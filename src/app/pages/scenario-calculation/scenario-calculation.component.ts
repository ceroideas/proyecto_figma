import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageComponent } from 'src/app/components/message/message.component';

@Component({
  selector: 'app-scenario-calculation',
  standalone: true,
  imports: [CommonModule, FormsModule, MessageComponent],
  templateUrl: './scenario-calculation.component.html',
  styleUrl: './scenario-calculation.component.scss',
})
export class ScenarioCalculationComponent {
  scenarioName: string = '';
  numEmployees: number = 100;
  salaryPerEmployee: number = 100000;
  sales: number = 150000;

  constructor(private router: Router) {}

  updateValues() {
    // Logic to update values if needed
  }

  getPercentageChange(currentValue: number, baseValue: number): string {
    const percentage = ((currentValue - baseValue) / baseValue) * 100;
    return percentage > 0
      ? `+${percentage.toFixed(0)}`
      : `${percentage.toFixed(0)}`;
  }

  previewImpact() {
    // Logic to preview impact
    console.log('Preview impact');
  }

  createScenario() {
    // Logic to create scenario
    console.log('Create scenario');
  }
  goBack(): void {
    this.router.navigate(['home/projects']);
  }

  formatMonto(monto: any): string {
    return Number(monto).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  selectedTd() {
    console.log('click td');
  }
  selectedDiv() {
    console.log('click div');
  }
}
