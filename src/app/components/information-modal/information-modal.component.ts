import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-information-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './information-modal.component.html',
  styleUrl: './information-modal.component.scss',
})
export class InformationModalComponent {
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

  constructor() {}

  setClickedElement(index: number) {
    this.clickedElement = index;
  }
}
