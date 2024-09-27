import { Component, inject, OnInit } from '@angular/core';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar'; // Importar MatProgressBarModule
import { CommonModule } from '@angular/common'; // Importar CommonModule para el uso de *ngIf
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogInComponent } from '../log-in/log-in.component';
import { ModalService } from '../../../services/modal.service';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormField,
    MatLabel,
    MatInput,
    MatProgressBarModule, 
    CommonModule 
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  passwordStrength: string = '';
  passwordStrengthValue: number = 0;
  passwordStrengthColor: string = 'primary';

  private readonly formBuilder = inject(FormBuilder);
  private readonly modalService = inject(ModalService);
  private userService = inject(UserService);
  private router = inject(Router);

  user: User = {
    username: '',
    password: '',
    email: '',
  };

  ngOnInit(): void {
    this._buildForm();
  }

  private _buildForm(): void {
    this.registerForm = this.formBuilder.nonNullable.group({
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(17)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(17)]],
      rePassword: ['', [Validators.required]]
    });
  }

  getPasswordStrength(password: string): string {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[\W_]/.test(password)) strength += 1;

    if (strength < 2) {
      return 'Baja';
    } else if (strength === 2) {
      return 'Media';
    } else {
      return 'Alta';
    }
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
        text: this.passwordStrength !== 'Alta' ? 'La contraseña no es segura' : 'Diligencia los campos correctamente',
        icon: 'error',
      });
      return;
    }

    const username = this.registerForm.value.username;
    const email = this.registerForm.value.email;
    const password = this.registerForm.value.password;
    const rePassword = this.registerForm.value.rePassword;

    if (password !== rePassword) {
      Swal.fire({
        title: 'Las contraseñas no coinciden',
        text: 'Inténtalo de nuevo',
        icon: 'error',
      });
      return;
    }

    const response = this.userService.register({ username, password, email });
    if (response.success) {
      Swal.fire({
        title: 'Registro exitoso!',
        icon: 'success',
      });
    } else {
      Swal.fire({
        title: 'Error en el registro',
        text: response.message,
        icon: 'error',
      });
    }
  }

  openLogIn(): void {
    this.modalService.openModal<LogInComponent, null>(LogInComponent);
  }
}
