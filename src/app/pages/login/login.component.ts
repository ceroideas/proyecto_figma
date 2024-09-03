import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  providers: [AuthService],
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  helper = new JwtHelperService();
  loginForm!: FormGroup;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authSvc: AuthService
  ) {}
  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      password: new FormControl(
        null,
        Validators.compose([
          Validators.minLength(8),
          Validators.pattern('^(?=.*[0-9]).*$'),
          Validators.required,
        ])
      ),
      email: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
    });
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onSubmit() {
    // Detener si el formulario no es válido
    if (this.loginForm.invalid) {
      return;
    }

    this.authSvc.login(this.loginForm.value).subscribe(
      (res: any) => {
        localStorage.setItem('token', res.access_token);
        let decodedToken = this.helper.decodeToken(res.access_token);
        console.log(decodedToken);
        this.router.navigate(['/home/projects']);
      },
      (error) => {
        console.log(error);
        /*       Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.error.message,
      }); */
      }
    );
  }

  goRegister(): void {
    this.router.navigate(['register']);
  }
}
