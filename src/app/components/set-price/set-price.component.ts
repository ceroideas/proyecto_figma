import { Component } from '@angular/core';

@Component({
  selector: 'app-set-price',
  standalone: true,
  imports: [],
  templateUrl: './set-price.component.html',
  styleUrl: './set-price.component.scss',
})
export class SetPriceComponent {
  selectedIndex: number | null = null;
  toggleStyles(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }
}
