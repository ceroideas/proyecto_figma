import { Component } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MustMatch } from './must-match.validator';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-register',
  providers: [AuthService],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  submitted = false;
  isLoading = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authSvc: AuthService
  ) {
    this.registerForm = this.formBuilder.group(
      {
        name: ['', Validators.required],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.email,
            Validators.pattern(
              '^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'
            ),
          ]),
        ],
        password: [
          '',
          Validators.compose([
            Validators.minLength(8),
            Validators.pattern('^(?=.*[0-9]).*$'),
            Validators.required,
          ]),
        ],
        confirmPassword: ['', Validators.required],
      },
      {
        validator: MustMatch('password', 'confirmPassword'),
      }
    );
  }

  // Getter para un acceso fácil a los campos de formulario
  get f(): { [key: string]: AbstractControl } {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;

    // Detener si el formulario no es válido
    if (this.registerForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authSvc.register(this.registerForm.value).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.goLogin();
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'The email is already exist',
          icon: 'error',
          iconColor: '#BC5800',
          customClass: {
            confirmButton: 'confirm',
          },
        });
        this.isLoading = false;
        console.log(error);
      },
    });
    console.log('Formulario válido', this.registerForm.value);
  }

  goLogin(): void {
    this.router.navigate(['login']);
  }
}
