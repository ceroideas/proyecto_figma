import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
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

  drop(event: any, item: string) {
    const currentPosition = this.getCurrentPosition(
      event.source.element.nativeElement
    );
    console.log(
      `La posición actual de ${item} es: x=${currentPosition.x}, y=${currentPosition.y}`
    );
  }

  getCurrentPosition(element: HTMLElement): { x: number; y: number } {
    const rect = element.getBoundingClientRect();
    return { x: rect.left, y: rect.top };
  }
}
