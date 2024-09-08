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
import { DataService } from 'src/app/services/data-service.service';
import Swal from 'sweetalert2';
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
  isLoading = false;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authSvc: AuthService,
    private dataSvc: DataService
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
    this.isLoading = true;

    this.authSvc.login(this.loginForm.value).subscribe({
      next: (response: any) => {
        localStorage.setItem('token', response.access_token);
        let decodedToken = this.helper.decodeToken(response.access_token);
        const userJSON = JSON.stringify(decodedToken);
        localStorage.setItem('user', userJSON);
        this.isLoading = false;
        this.router.navigate(['/home/projects']);
      },
      error: (error) => {
        this.isLoading = true;
        Swal.fire({
          title: 'Error',
          text: 'Incorrect email or password. Please try again.',
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
  }

  goRegister(): void {
    this.router.navigate(['register']);
  }
}
