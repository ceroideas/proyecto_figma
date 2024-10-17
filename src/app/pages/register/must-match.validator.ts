import { FormGroup } from '@angular/forms';

// Validador personalizado para verificar que dos campos coincidan
export function MustMatch(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];

    if (matchingControl.errors && !matchingControl.errors['mustMatch']) {
      // Retorna si otro validador ya encontró un error en el campo matchingControl
      return;
    }

    // Establece un error en el matchingControl si la validación falla
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ mustMatch: true });
    } else {
      matchingControl.setErrors(null);
    }
  };
}
