import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formateur',
  standalone: false,
  pure: false
})
export class FormateurPipe implements PipeTransform {

  transform(value: any) {
    return value ? new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(value) : 0;
  }

}
