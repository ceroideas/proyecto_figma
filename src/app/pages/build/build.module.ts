import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BuildComponent } from './build.component';
import { MessageComponent } from 'src/app/components/message/message.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { AdDirective } from './ad.directive';
import { EditVariableComponent } from 'src/app/components/edit-variable/edit-variable.component';
import { UniteModalComponent } from 'src/app/components/unite-modal/unite-modal.component';

import { ShapeModalComponent } from 'src/app/components/shape-modal/shape-modal.component';
import { FormsModule } from '@angular/forms';
import { SimulationShapeModalComponent } from 'src/app/components/simulation-shape-modal/simulation-shape-modal.component';

import { PipesModule } from '../../pipes/pipes.module';
// import { ReversePipe } from '../../pipes/reverse.pipe';

@NgModule({
  declarations: [BuildComponent, AdDirective], // Incluye BuildComponent aquí
  imports: [
    MessageComponent,
    DragDropModule,
    CommonModule,
    EditVariableComponent,
    UniteModalComponent,
    ShapeModalComponent,
    SimulationShapeModalComponent,
    
    FormsModule,
    PipesModule,
    // ReversePipe
  ],

  exports: [BuildComponent],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BuildModule {}
