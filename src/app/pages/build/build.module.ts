import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildComponent } from './build.component';
import { MessageComponent } from 'src/app/components/message/message.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AdDirective } from './ad.directive';
import { EditVariableComponent } from 'src/app/components/edit-variable/edit-variable.component';

@NgModule({
  declarations: [BuildComponent, AdDirective], // Incluye BuildComponent aquí
  imports: [
    MessageComponent,
    DragDropModule,
    CommonModule,
    EditVariableComponent,
  ], // Debes incluir módulos, no componentes
  exports: [BuildComponent],
})
export class BuildModule {}
