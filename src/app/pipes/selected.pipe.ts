import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'selected',
  standalone: false,
  pure: false
})
export class SelectedPipe implements PipeTransform {

  transform(value: any[], query: any) {
    let id = query.data[0].v;
    let condicion = value.findIndex(x=>x == id) !== -1;
    return condicion;
  }

}
