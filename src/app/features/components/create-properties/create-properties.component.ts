import { Component, inject, OnDestroy, signal} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { v4 as uuid4 } from "uuid";
import Swal from 'sweetalert2';
import { HeaderComponent } from '../../../layout/components/header/header.component';
import { FooterComponent } from '../../../layout/components/footer/footer.component';
import { UserService } from '../../../auth/services/user.service';
import { SupabaseBucketService } from '../../../services/supabase.service';
import { PropertyService } from '../../services/property.service';
import { Property } from '../../interfaces/property.interface';
import { Photo } from '../../interfaces/photo.interface';

@Component({
  selector: 'app-create-properties',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './create-properties.component.html',
  styleUrls: ['./create-properties.component.css']
})
export class CreatePropertiesComponent implements OnDestroy {

  uploadedUrls = signal<Photo[]>([])
  user;
  createPropertyForm!: FormGroup;
  savedProperty = false

  private formBuilder = inject(FormBuilder)
  private router = inject(Router)
  private userService = inject(UserService)
  private supabaseService = inject(SupabaseBucketService)
  private propertyService = inject(PropertyService)

  constructor(){
    this.user = this.userService.getUser()
    this.createPropertyForm = this.formBuilder.group({
      title: ['', Validators.required],
      address: ['', Validators.required],
      bedrooms: [null, Validators.required],
      capacity: [null, Validators.required],
      bathrooms: [null, Validators.required],
      description: ['', Validators.required],
      price: [null, Validators.required]
    });
  }

  ngOnDestroy(): void {
    if (!this.savedProperty){
      for (let image of this.uploadedUrls()){
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
        let newUrls:Photo[] = this.uploadedUrls()
        newUrls.push({ url: data! })
        this.uploadedUrls.set(newUrls); 
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
    if (this.uploadedUrls.length < 4) {
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
      photos: this.uploadedUrls()
    };
    try {
      this.propertyService.createProperty(newProperty)
      this.savedProperty = true
      Swal.fire({
        icon: "success",
        text: 'Propiedad guardada',
        timer: 2000
      })
      this.router.navigate(['/home']);
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
    let urls = this.uploadedUrls()
    const index = urls.findIndex(image => image.url === imageUrl);
    urls.splice(index, 1);
    this.uploadedUrls.set(urls);
    this.supabaseService.deletePhoto(imageUrl, 'staynest', this.user().username)
  }
}

