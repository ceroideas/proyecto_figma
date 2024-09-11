import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
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
import { MustMatch } from '../register/must-match.validator';
@Component({
  selector: 'app-restore-password',
  standalone: true,
  providers: [AuthService, DataService],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './restore-password.component.html',
  styleUrl: './restore-password.component.scss',
})
export class RestorePasswordComponent {
  helper = new JwtHelperService();
  sendEmailForm!: FormGroup;
  codeForm!: FormGroup;
  changeForm!: FormGroup;
  isLoading = false;
  stepOne: boolean = true;
  stepTwo: boolean = false;
  stepThree: boolean = false;
  email!: any;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authSvc: AuthService,
    private dataSvc: DataService
  ) {}

  ngOnInit(): void {
    this.sendEmailForm = this.formBuilder.group({
      email: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$'),
        ])
      ),
    });

    this.codeForm = this.formBuilder.group({
      code: new FormControl(
        null,
        Validators.compose([Validators.minLength(6), Validators.required])
      ),
    });

    this.changeForm = this.formBuilder.group(
      {
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

  get f(): { [key: string]: AbstractControl } {
    return this.sendEmailForm.controls;
  }

  get c(): { [key: string]: AbstractControl } {
    return this.codeForm.controls;
  }

  get p(): { [key: string]: AbstractControl } {
    return this.changeForm.controls;
  }

  onSubmitOne() {
    // Detener si el formulario no es válido
    if (this.sendEmailForm.invalid) {
      return;
    }
    this.isLoading = true;

    this.authSvc.sendCode(this.sendEmailForm.value).subscribe({
      next: (response: any) => {
        this.dataSvc.emailData(response);
        this.stepOne = false;
        this.stepTwo = true;
        this.isLoading = false;
        this.email = this.sendEmailForm.value.email;
        console.log(response, 'DATA EMAIL');
      },
      error: (error) => {
        Swal.fire({
          title: 'Error',
          text: 'Incorrect email. Please try again.',
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

  onSubmitTwo() {
    // Detener si el formulario no es válido
    if (this.codeForm.invalid) {
      return;
    }
    this.isLoading = true;

    const codeObject = this.codeForm.value;
    const hashCode = this.dataSvc.getEmailData();
    codeObject.hashed = hashCode.hashed;
    console.log(this.dataSvc.getEmailData(), 'CODE');

    this.authSvc.checkCode(codeObject).subscribe({
      next: (response: any) => {
        this.stepTwo = false;
        this.stepThree = true;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = true;
        Swal.fire({
          title: 'Error',
          text: 'Incorrect code. Please try again.',
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

  onSubmitThree() {
    // Detener si el formulario no es válido
    if (this.changeForm.invalid) {
      return;
    }
    this.isLoading = true;

    const changePassword = {
      email: this.email,
      emailHashed: this.dataSvc.getEmailData().emailHashed,
      password: this.changeForm.value.password,
    };

    this.authSvc.changePassword(changePassword).subscribe({
      next: (response: any) => {
        this.isLoading = false;

        this.dataSvc.emailData(null);
        Swal.fire({
          title: 'Success',
          text: 'The password was change!',
          icon: 'success',
          iconColor: '#BC5800',
          customClass: {
            confirmButton: 'confirm',
          },
        });

        setTimeout(() => {
          this.router.navigate(['login']);
          this.stepThree = false;
        }, 2000);
      },
      error: (error) => {
        this.isLoading = true;
        Swal.fire({
          title: 'Error',
          text: 'Please try again.',
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
}
