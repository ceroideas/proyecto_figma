import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SetPriceComponent } from 'src/app/components/set-price/set-price.component';
import { PipesModule } from 'src/app/pipes/pipes.module';

@Component({
  selector: 'app-inspect',
  standalone: true,
  imports: [CommonModule, FormsModule, PipesModule],
  templateUrl: './inspect.component.html',
  styleUrl: './inspect.component.scss',
})
export class InspectComponent {
  selectedIndex: number | null = null;
  clickedElement: number = 0;

  datas: any[] = [
    { tier: 'L0', value: '15.325.896', description: 'Lorem lorem lorem' },
    { tier: 'L0', value: '15.325.896', description: 'Lorem lorem lorem' },
    { tier: 'L0', value: '15.325.896', description: 'Lorem lorem lorem' },
    { tier: 'L0', value: '15.325.896', description: 'Lorem lorem lorem' },
    { tier: 'L0', value: '15.325.896', description: 'Lorem lorem lorem' },
    { tier: 'L0', value: '15.325.896', description: 'Lorem lorem lorem' },
    { tier: 'L0', value: '15.325.896', description: 'Lorem lorem lorem' },
    { tier: 'L0', value: '15.325.896', description: 'Lorem lorem lorem' },
  ];

  constructor(private router: Router) {}

  toggleStyles(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  goWaterfall() {
    this.router.navigate(['/home/waterfall']);
  }

  setClickedElement(index: number) {
    this.clickedElement = index;
  }
}
