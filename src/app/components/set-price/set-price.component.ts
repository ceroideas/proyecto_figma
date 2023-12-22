import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-set-price',
  standalone: true,
  imports: [],
  templateUrl: './set-price.component.html',
  styleUrl: './set-price.component.scss',
})
export class SetPriceComponent {
  selectedIndex: number | null = null;

  constructor(private router: Router) {}

  toggleStyles(index: number) {
    this.selectedIndex = this.selectedIndex === index ? null : index;
  }

  goWaterfall() {
    this.router.navigate(['/home/inspect/waterfall']);
  }
}
