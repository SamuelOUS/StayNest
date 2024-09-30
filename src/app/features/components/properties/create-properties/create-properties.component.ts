import { Component } from '@angular/core';
import { HeaderComponent } from '../../../../layout/components/header/header.component';
import { FooterComponent } from '../../../../layout/components/footer/footer.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CreatePropertiesService } from './services/create-properties.service';
import uuid4 from "uuid4";
import Swal from 'sweetalert2';
import { UserService } from '../../../../auth/services/user.service';
import { time } from 'console';

@Component({
  selector: 'app-create-properties',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './create-properties.component.html',
  styleUrls: ['./create-properties.component.css']
})
export class CreatePropertiesComponent {

  user;
  uploadedUrl ='';
  createPropertiesForm: FormGroup;
  imageUrls: string[] = Array(1).fill('');

  constructor(private fb: FormBuilder, private router: Router, private CreatePropertiesService: CreatePropertiesService, private userService: UserService) {



    this.user = userService.getUser();

    this.createPropertiesForm = this.fb.group({

      tittle: ['', [Validators.required]],
      description: ['', [Validators.required]],
      address: ['', [Validators.required]],
      price: ['', [Validators.required]],

    });
  }

  getNextPropertyId(): number {
    const currentId = localStorage.getItem('propertyId');
    const nextId = currentId ? parseInt(currentId) + 1 : 1;
    localStorage.setItem('propertyId', nextId.toString());
    return nextId;
  }

  uploadImage(event : Event){

    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });

    let inputFile

    let input = event.target as HTMLInputElement;

    if (input.files!.length <= 0) {
      return;
    }

    const fileName = uuid4();

    let file: File = input.files![0];

    this.CreatePropertiesService.uploadImage(file, fileName, this.user().username).then
    (data=>{this.uploadedUrl = data!;})
    Swal.close();
    input

    this.CreatePropertiesService.uploadImage(file, fileName, this.user().username)
    
    
  }


  onSubmit() {

    if (!this.createPropertiesForm.valid) {
      Swal.fire('Error', 'Por favor, completa todos los campos requeridos.', 'error');
      return;
    }

    const propertyData = {
      id: this.getNextPropertyId(), 
      tittle: this.createPropertiesForm.value.tittle,
      description: this.createPropertiesForm.value.description,
      address: this.createPropertiesForm.value.address,
      price: this.createPropertiesForm.value.price,
      images: this.uploadedUrl
    };

    
    const properties = JSON.parse(localStorage.getItem('properties') || '[]');
    properties.push(propertyData);
    localStorage.setItem('properties', JSON.stringify(properties));

    Swal.fire('¡Éxito!', 'La propiedad ha sido creada.', 'success');

    this.createPropertiesForm.reset();
    this.imageUrls = Array(1).fill('');
  }
  onCancel() {
    
    this.router.navigate(['/home']); 
  }
}

