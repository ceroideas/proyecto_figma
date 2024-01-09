import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, DragDropModule],
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

  contenido: string | null = null;
  @Output() algunEvento: EventEmitter<any> = new EventEmitter<any>();
  show() {
    this.showMessage = false;
  }
}
