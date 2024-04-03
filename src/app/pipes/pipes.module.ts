import { NgModule } from '@angular/core';
import { ReversePipe } from './reverse.pipe';
import { SearchPipe } from './search.pipe';
import { SelectedPipe } from './selected.pipe';

@NgModule({
	declarations: [ReversePipe,SearchPipe,SelectedPipe],
	imports: [],
	exports: [ReversePipe,SearchPipe,SelectedPipe]
})
export class PipesModule {}
