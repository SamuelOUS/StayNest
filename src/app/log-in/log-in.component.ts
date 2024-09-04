import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormField, MatLabel, MatInput],
  template: `
    <section class="top">
      <h2 mat-dialog-title>Iniciar Sesión</h2>
      <span class="close" [mat-dialog-close]="false" type="button">&times;</span>
    </section>
    <section class="modal-content">
      <form [formGroup]="logInForm">
        <mat-form-field>
          <mat-label for="username">Nombre de Usuario:</mat-label>
          <input matInput formControlName="username">
        </mat-form-field>

        <mat-form-field>
          <mat-label for="password">Contraseña:</mat-label>
          <input type="password" matInput formControlName="password">
        </mat-form-field>

        <section mat-dialog-actions class="bottom">
          <button mat-raised-button type="button" >Iniciar sesión</button>
        </section>
      </form>
    </section>
  `,
  styleUrl: `../register/register.component.css`
})
export class LogInComponent implements OnInit{

  logInForm!: FormGroup
  private readonly _fb = inject(FormBuilder)

  ngOnInit(): void {
      this._buildForm()
  }

  closeModal(): void {
    this.closeModal()
  }

  private _buildForm():void{
    this.logInForm = this._fb.nonNullable.group({
      username: ['', [Validators.required, ]],
      password: ['', [Validators.required, ]],
    })

  }
}
