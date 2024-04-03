import { NgModule } from '@angular/core';
import { ReversePipe } from './reverse.pipe';
import { SearchPipe } from './search.pipe';
import { SelectedPipe } from './selected.pipe';
import { FormateurPipe } from './formateur.pipe';

@NgModule({
	declarations: [ReversePipe,SearchPipe,SelectedPipe,FormateurPipe],
	imports: [],
	exports: [ReversePipe,SearchPipe,SelectedPipe,FormateurPipe]
})
export class PipesModule {}
