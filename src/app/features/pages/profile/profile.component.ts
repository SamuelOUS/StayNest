import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../auth/services/user.service';
import { CommonModule } from '@angular/common'; 
import { User } from '../../../auth/interfaces/user.interface';
import Swal from 'sweetalert2';
import { v4 as uuidv4 } from 'uuid';
import { SupabaseService } from '../../../services/supabase.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit{

  private readonly formBuilder = inject(FormBuilder)
  private readonly userService = inject(UserService)
  private readonly supabaseService = inject(SupabaseService)
  profileForm!: FormGroup
  user;
  uploadedPhoto: string | undefined 
  
  constructor(){
    this.user = this.userService.getUser()
    const photo = this.user().photo
    this.uploadedPhoto = photo ? photo : 'user.png'
  }
  
  ngOnInit(): void {
    this.profileForm = this.formBuilder.nonNullable.group({
      username: [this.user().username, [Validators.required, Validators.minLength(3)]],
      biography: [this.user().biography, [Validators.maxLength(500)]],
      password: ['', [Validators.minLength(8)]],
      confirmPassword: ['']
    }, { validators: this.checkPasswords });

  }

  // Gestión para la foto de perfil
  onFileUpload(event:Event){
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null); // Muestra el indicador de carga
      }
    });
    let inputFile = event.target as HTMLInputElement;
    if(!inputFile.files || inputFile.files.length <= 0){
      return;
    }
    const file: File = inputFile.files[0];
    const fileName = uuidv4();
    this.supabaseService
      .upload(file, fileName, this.user().username)
      .then(data =>{
        this.uploadedPhoto = data!;
        this.userService.editUser({ 
          username: this.user().username,
          password: this.user().password,
          photo: this.uploadedPhoto
        });
        Swal.close();
        inputFile.value = '';
    }).catch(()=>{
      Swal.close();
        Swal.fire('Error', 'Ocurrió un error al cargar los datos', 'error');
    });
  }

  // Gestión del evento de envío del formulario
  onSubmit(): void {
    if (!this.profileForm.valid) {  
      Swal.fire({
        text:'Debe diligenciar los campos correctamente',
        icon:'error'
      });  
      return
    }
    const editedUser: User = {
      username: this.profileForm.value.username || this.user().username,
      biography: this.profileForm.value.biography || this.user().biography,
      password: this.profileForm.value.password || this.user().password,
    }
    this.userService.editUser(editedUser)
    Swal.fire({
      text:'Cambios realizados',
      icon:'success'
    });
    this.profileForm.setValue({
      username: this.user().username,
      biography: this.user().biography,
      password: '',
      confirmPassword: ''
    })
  }
  private checkPasswords(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }
}
