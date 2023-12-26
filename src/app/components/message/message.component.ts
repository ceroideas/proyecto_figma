import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss',
})
export class MessageComponent {
  @Input() content: string = '';
  @Input() color: string = 'blue';
  @Input() background: string = '';
  @Input() icon: string = '';
  @Input() closeIcon: string = '';
}
