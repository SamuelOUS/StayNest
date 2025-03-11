import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserService } from '../../../auth/services/user.service';
import { CommonModule } from '@angular/common';
import { User } from '../../../auth/interfaces/user.interface';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseBucketService } from '../../../services/supabase.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent implements OnInit, OnDestroy {
  private readonly formBuilder = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly supabaseService = inject(SupabaseBucketService);
  profileForm!: FormGroup;
  user;
  uploadedPhoto = '';
  passwordType: string = 'password';
  confirmPasswordType: string = 'password';
  userWasUpdated = false;

  constructor() {
    this.user = this.userService.getUser();
  }

  ngOnInit(): void {
    this.profileForm = this.formBuilder.nonNullable.group(
      {
        name: [
          this.user().name,
          [Validators.required, Validators.minLength(3)],
        ],
        biography: [this.user().bio, [Validators.maxLength(500)]],
        password: ['', [Validators.minLength(8)]],
        confirmPassword: [''],
      },
      { validators: this.checkPasswords }
    );
  }

  ngOnDestroy(): void {
    if (!this.userWasUpdated && this.uploadedPhoto) {
      this.supabaseService.deletePhoto(
        this.uploadedPhoto,
        'profile',
        this.user().username
      );
    }
  }

  // Gestión para la foto de perfil
  onFileUpload(event: Event) {
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null); // Muestra el indicador de carga
      },
    });
    let inputFile = event.target as HTMLInputElement;
    if (!inputFile.files || inputFile.files.length <= 0) {
      return;
    }
    const file: File = inputFile.files[0];
    const fileName = uuidv4();
    this.supabaseService
      .upload(file, fileName, this.user().username, 'profiles')
      .then((data) => {
        this.uploadedPhoto = data!;
        Swal.close();
        inputFile.value = '';
      })
      .catch(() => {
        Swal.close();
        Swal.fire('Error', 'Ocurrió un error al cargar los datos', 'error');
      });
  }

  // Gestión del evento de envío del formulario
  onSubmit(): void {
    if (!this.profileForm.valid) {
      Swal.fire({
        text: 'Debe diligenciar los campos correctamente',
        icon: 'error',
      });
      return;
    }
    const editedUser: User = {
      username: this.user().username,
      name: this.profileForm.value.name || this.user().username,
      bio: this.profileForm.value.biography || this.user().bio,
      password: this.profileForm.value.password || this.user().password,
      profilePicture: this.uploadedPhoto,
    };
    try {
      this.userService.editUser(editedUser).subscribe();
      this.userWasUpdated = true;
      Swal.fire({
        text: 'Cambios realizados',
        icon: 'success',
      });
      this.profileForm.reset();
    } catch (error) {
      Swal.fire({
        text: 'Ocurrió un error al actualizar los datos',
        icon: 'error',
      });
    }
  }
  private checkPasswords(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  togglePasswordVisibility() {
    this.passwordType = this.passwordType === 'password' ? 'text' : 'password';
  }
  toggleConfirmPasswordVisibility() {
    this.confirmPasswordType =
      this.confirmPasswordType === 'password' ? 'text' : 'password';
  }
}
