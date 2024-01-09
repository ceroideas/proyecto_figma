import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildComponent } from './build.component';
import { MessageComponent } from 'src/app/components/message/message.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AdDirective } from './ad.directive';

@NgModule({
  declarations: [BuildComponent, AdDirective], // Incluye BuildComponent aquí
  imports: [MessageComponent, DragDropModule, CommonModule], // Debes incluir módulos, no componentes
  exports: [BuildComponent],
})
export class BuildModule {}
