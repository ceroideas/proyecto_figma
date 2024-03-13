import { NgModule } from '@angular/core';
import { ReversePipe } from './reverse.pipe';
import { SearchPipe } from './search.pipe';

@NgModule({
	declarations: [ReversePipe,SearchPipe],
	imports: [],
	exports: [ReversePipe,SearchPipe]
})
export class PipesModule {}
