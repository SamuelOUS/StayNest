import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from '../../services/property.service';
import { UserService } from '../../../auth/services/user.service';
import { Property } from '../../interfaces/property.interface';
import { Photo } from '../../interfaces/photo.interface';
import { SupabaseBucketService } from '../../../services/supabase.service';
import Swal from 'sweetalert2';
import { v4 as uuid4 } from "uuid";
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-property',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './edit-property.component.html',
  styleUrl: './edit-property.component.css'
})
export class EditPropertyComponent implements OnDestroy {
  property!:Property;
  propertyId: string = '';
  allPhotos: Photo[] = []
  uploadedUrls:Photo[] = []
  editPropertyForm!: FormGroup;
  wasUpdated = false
  user;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private supabaseService: SupabaseBucketService,
    private userService: UserService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.user = this.userService.getUser();
    this.editPropertyForm = this.formBuilder.group({
      title: [ '', [Validators.minLength(3), Validators.maxLength(50)]],
      address: ['', [Validators.minLength(3), Validators.maxLength(50)]],
      bedrooms: [null, [Validators.min(1), Validators.max(100)]],
      capacity: [null, [Validators.min(1), Validators.max(1000)]],
      bathrooms: [null, [Validators.min(0), Validators.max(100)]],
      description: ['', [Validators.minLength(10)]],
      price: [null, [Validators.min(1), Validators.max(999999999999)]]
  });
  }

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;
    this.propertyService.getProperty(this.propertyId).subscribe(
      property => {
        this.property = property;
        this.allPhotos = this.property.photos;
        this.editPropertyForm.patchValue({
          title: this.property.title,
          address: this.property.address,
          bedrooms: this.property.bedrooms,
          capacity: this.property.capacity,
          bathrooms: this.property.bathrooms,
          description: this.property.description,
          price: this.property.pricePerNight,
        });
      }
    );   
  }

  ngOnDestroy(): void {
    if (!this.wasUpdated){
      this.uploadedUrls.forEach(
        photo => 
          this.supabaseService.deletePhoto(photo.url, 'staynest', this.user().username)
      )
    }
  }

  onSubmit() {
    if (!this.editPropertyForm.valid) {
      Swal.fire({
        icon: "error",
        text: 'Formulario inválido, completa todos los campos correctamente',
      });
      return;
    }

    const newProperty:Property = {
      id:this.propertyId,
      title: this.editPropertyForm.value.title || this.property.title,
      description: this.editPropertyForm.value.description || this.property.description,
      address: this.editPropertyForm.value.address || this.property.address,
      pricePerNight: this.editPropertyForm.value.price || this.property.pricePerNight,
      capacity: this.editPropertyForm.value.capacity || this.property.capacity,
      bedrooms: this.editPropertyForm.value.bedrooms || this.property.bedrooms,
      bathrooms: this.editPropertyForm.value.bathrooms || this.property.bathrooms,
      photos: this.allPhotos
    };
    try {
      this.propertyService.updateProperty(this.propertyId, newProperty)
      this.wasUpdated = true
      Swal.fire({
        icon: "success",
        text: 'Propiedad Actualizada',
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
        this.uploadedUrls.push({ url: data! })
        this.allPhotos.push({ url: data! })
        Swal.close();
      }).catch(error => {
        Swal.close();
        Swal.fire({
          icon: "error",
          text: 'Ocurrió un error',
        })
      });
  }
}
