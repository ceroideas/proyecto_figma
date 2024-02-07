import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildComponent } from './build.component';
import { MessageComponent } from 'src/app/components/message/message.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AdDirective } from './ad.directive';
import { EditVariableComponent } from 'src/app/components/edit-variable/edit-variable.component';
import { UniteModalComponent } from 'src/app/components/unite-modal/unite-modal.component';
import { ProjectService } from 'src/app/services/project.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [BuildComponent, AdDirective], // Incluye BuildComponent aquí
  imports: [
    MessageComponent,
    DragDropModule,
    CommonModule,
    EditVariableComponent,
    UniteModalComponent,
    HttpClientModule,
  ],

  exports: [BuildComponent],
})
export class BuildModule {}
