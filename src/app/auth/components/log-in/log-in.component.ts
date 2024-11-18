import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { ModalService } from '../../../services/modal.service';
import { RegisterComponent } from '../register/register.component';
import { User } from '../../interfaces/user.interface';
import { UserService } from '../../services/user.service';
import Swal from 'sweetalert2'

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [ReactiveFormsModule, MatDialogModule, MatFormField, MatLabel, MatInput],
  templateUrl: 'log-in.component.html',
})
export class LogInComponent implements OnInit{

  logInForm!: FormGroup
  // Inyección de servicios
  private readonly formBuilder = inject(FormBuilder)
  private readonly modalService = inject(ModalService);
  private readonly userService = inject(UserService);

  user: User = {
    username: '',
    password: '',
  }

  ngOnInit(): void {
    this.logInForm = this.formBuilder.nonNullable.group({
      username: ['', [Validators.required, ]],
      password: ['', [Validators.required, ]],
    })
  }

  onLogin(){
    if(!this.logInForm.valid){
      Swal.fire({
        text: 'Digilencia los campos correctamente',
        icon: 'error',
      })
      return;
    }

    let username = this.logInForm.value.username;
    let password = this.logInForm.value.password;

    this.userService.logIn(username, password).subscribe({
      next:() => {
        Swal.fire({
          icon: 'success',
          text: 'Inicio exitoso',
          timer: 2000
        })
      },
      error: (message) =>{
        Swal.fire({
          text: message,
          icon: 'error',
        })
      } 
    })
  }
  
  openRegister(): void {
    this.modalService.openModal<RegisterComponent, null>(RegisterComponent);
  }

}
