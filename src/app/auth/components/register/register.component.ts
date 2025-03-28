  import { Component, inject, OnInit } from '@angular/core';
  import { CommonModule } from '@angular/common';
  import { LogInComponent } from '../log-in/log-in.component';
  import { ModalService } from '../../../services/modal.service';
  import { User } from '../../interfaces/user.interface';
  import { UserService } from '../../services/user.service';
  import Swal from 'sweetalert2';
  import {
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    Validators,
  } from '@angular/forms';
  import { MatFormFieldModule } from '@angular/material/form-field';
  import { MatInputModule } from '@angular/material/input';
  import { MatCheckboxModule } from '@angular/material/checkbox';
  import { MatDialogModule } from '@angular/material/dialog';
  import { MatProgressBarModule } from '@angular/material/progress-bar';

  @Component({
    selector: 'app-register',
    standalone: true,
    imports: [
      CommonModule,
      ReactiveFormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatCheckboxModule,
      MatDialogModule,
      MatProgressBarModule,
    ],
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css'],
  })
  export class RegisterComponent implements OnInit {
    registerForm!: FormGroup;
    passwordStrength: string = '';
    passwordStrengthValue: number = 0;
    passwordStrengthColor: string = 'primary';

    private readonly formBuilder = inject(FormBuilder);
    private readonly modalService = inject(ModalService);
    private readonly userService = inject(UserService);

    user: User = {
      username: '',
      password: '',
      email: '',
    };

    get usernameErrors(): string {
      const usernameControl = this.registerForm.get('username');
      if (usernameControl?.hasError('minlength')) {
        return 'El nombre de usuario debe tener al menos 8 caracteres';
      }
      if (usernameControl?.hasError('maxlength')) {
        return 'El nombre de usuario no puede tener más de 17 caracteres';
      }
      if (usernameControl?.hasError('pattern')) {
        return 'El nombre de usuario debe comenzar con una letra y solo puede contener letras y números';
      }
      return '';
    }

    ngOnInit(): void {
      this._buildForm();
    }

    private _buildForm(): void {
      this.registerForm = this.formBuilder.nonNullable.group({
        name: [
          '',
          [
            Validators.required,
          ],
        ],
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(16),
            Validators.pattern(/^[a-zA-Z][a-zA-Z0-9]{7,16}$/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            Validators.maxLength(25),
          ],
        ],
        rePassword: ['', [Validators.required]],
        isOwner: [false],
      });
    }

  getPasswordStrength(password: string): string {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/\d/.test(password)) strength += 1;
    if (/[\W_]/.test(password)) strength += 1;
    if (strength < 2) return 'Baja';
    if (strength === 2) {
      return 'Media';
    }
    return 'Alta';
  }

    checkPasswordStrength(): void {
      const password = this.registerForm.get('password')?.value || '';
      this.passwordStrength = this.getPasswordStrength(password);

      switch (this.passwordStrength) {
        case 'Baja':
          this.passwordStrengthValue = 33;
          this.passwordStrengthColor = 'warn';
          break;
        case 'Media':
          this.passwordStrengthValue = 66;
          this.passwordStrengthColor = 'accent';
          break;
        case 'Alta':
          this.passwordStrengthValue = 100;
          this.passwordStrengthColor = 'primary';
          break;
      }
    }

    onRegister() {
      if (!this.registerForm.valid || this.passwordStrength !== 'Alta') {
        Swal.fire({
          title: 'Mal registro :(',
          text:
            this.passwordStrength !== 'Alta'
              ? 'Contraseña insegura'
              : 'Diligencia los campos correctamente',
          icon: 'error',
        });
        return;
      }

      const name = this.registerForm.value.name;
      const username = this.registerForm.value.username;
      const email = this.registerForm.value.email;
      const password = this.registerForm.value.password;
      const rePassword = this.registerForm.value.rePassword;
      const isOwner = this.registerForm.value.isOwner;

      if (password !== rePassword) {
        Swal.fire({
          title: 'Las contraseñas no coinciden',
          text: 'Inténtalo de nuevo',
          icon: 'error',
        });
        return;
      }

      this.userService
        .register({ name, username, email, password, isOwner })
        .subscribe({
          next: () => {
            Swal.fire({
              text: 'Registro exitoso',
              icon: 'success',
            });
          },
          error: (error) => {
            Swal.fire({
              title: 'Error',
              text: error,
              icon: 'error',
            });
          },
        });
    }

    openLogIn(): void {
      this.modalService.openModal<LogInComponent, null>(LogInComponent);
    }
  }
