import { Component, inject, OnInit } from '@angular/core';
import { MatFormField, MatLabel} from '@angular/material/form-field'
import { MatInput } from '@angular/material/input';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormField, MatLabel, MatInput],
  template: `
  <div class="modal">
    <section class="top">
      <h2 mat-dialog-title>Registrarse</h2>
      <span class="close" [mat-dialog-close]="false" type="button">&times;</span>
    </section>
    <section class="modal-content">
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
        <section mat-dialog-actions class="bottom">
          <button mat-raised-button type="button" >Registrarse</button>
        </section>
      </form>
    </section>
  </div>
  `,
  styleUrl: `./register.component.css`
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup
  private readonly _fb = inject(FormBuilder)

  ngOnInit(): void {
      this._buildForm()
  }

  closeModal(): void {
    this.closeModal()
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
    this.registerForm.get('password')?.valueChanges.subscribe((password) => {
      if(this.registerForm.get('rePassword')?.value === password){
        this.registerForm.get('rePassword')?.setErrors(null)
      }else{
        this.registerForm.get('rePassword')?.setErrors({notMatch: true})
      }
    })
  }
}
