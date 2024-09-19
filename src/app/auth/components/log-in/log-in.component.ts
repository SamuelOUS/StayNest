import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ModalService } from '../../../services/modal.service';
import { RegisterComponent } from '../register/register.component';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormField, MatLabel, MatInput],
  template: `
    <div class="top">
      <h2 mat-dialog-title>Iniciar Sesión</h2>
      <span class="close" [mat-dialog-close]="false" type="button">&times;</span>
    </div>
    <div class="modal-content">
      <form [formGroup]="logInForm">
        <mat-form-field>
          <mat-label for="username">Nombre de Usuario:</mat-label>
          <input matInput formControlName="username">
        </mat-form-field>

        <mat-form-field>
          <mat-label for="password">Contraseña:</mat-label>
          <input type="password" matInput formControlName="password">
        </mat-form-field>

        <div mat-dialog-actions class="bottom">
          <button mat-raised-button (click)="onLogin()" type="button" >Iniciar sesión</button>
        </div>
        <a mat-menu-item type="button" [mat-dialog-close]="false" (click)="openRegister()">¿Aún no tienes una cuenta?</a>
      </form>
    </div>
  `,
})
export class LogInComponent implements OnInit{

  logInForm!: FormGroup
  private readonly _fb = inject(FormBuilder)
  private readonly _modalSvc = inject(ModalService);

  ngOnInit(): void {
      this._buildForm()
  }

  private _buildForm():void{
    this.logInForm = this._fb.nonNullable.group({
      username: ['', [Validators.required, ]],
      password: ['', [Validators.required, ]],
    })
  }


  onLogin(){
    console.log('onLogin')
  }
  openRegister(): void {
    this._modalSvc.openModal<RegisterComponent, null>(RegisterComponent);
  }

}
