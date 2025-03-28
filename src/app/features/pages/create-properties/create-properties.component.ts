import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { v4 as uuid4 } from "uuid";
import Swal from 'sweetalert2';
import { UserService } from '../../../auth/services/user.service';
import { SupabaseBucketService } from '../../../services/supabase.service';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../interfaces/property.interface';
import { Photo } from '../../interfaces/photo.interface';

@Component({
  selector: 'app-create-properties',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './create-properties.component.html',
  styleUrls: ['./create-properties.component.css']
})
export class CreatePropertiesComponent implements OnDestroy {

  uploadedUrls:Photo[] = []
  user;
  createPropertyForm!: FormGroup;
  savedProperty = false

  private readonly formBuilder = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly userService = inject(UserService)
  private readonly supabaseService = inject(SupabaseBucketService)
  private readonly propertyService = inject(PropertyService)

  constructor(){
    this.user = this.userService.getUser()
    this.createPropertyForm = this.formBuilder.group({
      title: [ '', [Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      bedrooms: [null, [Validators.min(1), Validators.max(100)]],
      capacity: [null, [Validators.min(1), Validators.max(1000)]],
      bathrooms: [null, [Validators.min(0), Validators.max(100)]],
      description: ['', [Validators.minLength(10)]],
      price: [null, [Validators.min(1), Validators.max(999999999999)]]
    });
  }

  ngOnDestroy(): void {
    if (!this.savedProperty){
      for (let image of this.uploadedUrls){
        this.supabaseService.deletePhoto(image.url, 'staynest', this.user().username)
      }
    }
  }

  uploadImage(event : Event){
    let input = event.target as HTMLInputElement;
    if (input.files!.length <= 0) {
      return;
    }
    Swal.fire({
      title: 'Cargando...',
      text: 'Por favor espera',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading(null);
      }
    });
    const fileName = uuid4();
    let file: File = input.files![0];
    this.supabaseService.upload(file, fileName, this.user().username, 'staynest')
      .then(data => { 
        this.uploadedUrls.push({ url: data })
        Swal.close();
      }).catch(error => {
        Swal.close();
        Swal.fire({
          icon: "error",
          text: 'Ocurrió un error',
        })
      });
  }


  onSubmit() {
    if (!this.createPropertyForm.valid) {
      Swal.fire({
        icon: "error",
        text: 'Formulario inválido, completa todos los campos',
      });
      return;
    }
    if (this.uploadedUrls.length < 4 || this.uploadedUrls.length > 6) {
      Swal.fire({
        icon: "error",
        text: 'Agrega al menos 4 fotos',
      });
      return;
    }

    const newProperty:Property = {
      title: this.createPropertyForm.value.title,
      description: this.createPropertyForm.value.description,
      address: this.createPropertyForm.value.address,
      pricePerNight: this.createPropertyForm.value.price,
      capacity: this.createPropertyForm.value.capacity,
      bedrooms: this.createPropertyForm.value.bedrooms,
      bathrooms: this.createPropertyForm.value.bathrooms,
      photos: this.uploadedUrls
    };
    try {
      this.propertyService.createProperty(newProperty)
      this.savedProperty = true
      Swal.fire({
        icon: "success",
        text: 'Propiedad guardada',
        timer: 2000
      })
    } catch (error) {
      Swal.fire({
        icon: "error",
        text: 'Ocurrió un error al guardar la propiedad',
      })
    }
  }

  onCancel() {
    this.router.navigate(['/home']);
  }

  deleteImage(imageUrl:string){
    const index = this.uploadedUrls.findIndex(image => image.url === imageUrl);
    this.uploadedUrls.splice(index, 1);
    this.supabaseService.deletePhoto(imageUrl, 'staynest', this.user().username)
  }
}

