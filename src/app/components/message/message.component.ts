import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input() content: string = '';
  @Input() color: string = 'blue';
  @Input() background: string = '';
  @Input() icon: string = '';
  @Input() closeIcon: string = '';
  showMessage: boolean = true;

  show() {
    this.showMessage = false;
  }
}
