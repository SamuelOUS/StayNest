import { Component, inject, OnInit } from '@angular/core';
import { MatFormField, MatLabel} from '@angular/material/form-field'
import { MatInput } from '@angular/material/input';
import { MatDialogModule} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LogInComponent } from '../log-in/log-in.component';
import { ModalService } from '../../../services/modal.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormField, MatLabel, MatInput],
  template: `
    <div class="top">
      <h2 mat-dialog-title>Registrarse</h2>
      <span class="close" [mat-dialog-close]="false" type="button">&times;</span>
    </div>
    <div class="modal-content">
      <form [formGroup]="registerForm">
        <mat-form-field>
          <mat-label for="username">Nombre de Usuario:</mat-label>
          <input matInput formControlName="username">
        </mat-form-field>
        <mat-form-field>
          <mat-label for="email">Correo Electrónico:</mat-label>
          <input matInput formControlName="email">
        </mat-form-field>

        <mat-form-field>
          <mat-label for="password">Contraseña:</mat-label>
          <input type="password" matInput formControlName="password">
        </mat-form-field>

        <mat-form-field>
          <mat-label for="rePassword">Confirmar Contraseña:</mat-label>
          <input type="password" matInput formControlName="rePassword">    
        </mat-form-field>
        <div mat-dialog-actions class="bottom">
          <button mat-raised-button type="button" >Registrarse</button>
        </div>
        <a mat-menu-item [mat-dialog-close]="false" type="button" (click)="openLogIn()">¿Ya tienes una cuenta?</a>
      </form>
    </div>
  `,
  styles: ``
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup
  private readonly _fb = inject(FormBuilder)

  // Servicio para acceder a los modales
  private readonly _modalSvc = inject(ModalService);

  ngOnInit(): void {
      this._buildForm()
  }

  openLogIn(): void {
    this._modalSvc.openModal<LogInComponent, null>(LogInComponent);
  }

  private _buildForm():void{
    this.registerForm = this._fb.nonNullable.group({
      // Añadir más validaciones...
      username: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(12), Validators.maxLength(20)]],
      rePassword: ['', [Validators.required]]
    })

    //Verificar que password y rePassword son iguales
    
  }
}
