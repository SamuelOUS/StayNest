import { Component, inject } from '@angular/core';
import { Property } from '../../interfaces/property.interface';
import { PropertyService } from '../../services/property.service';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { UserService } from '../../../auth/services/user.service';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-properties.component.html',
  styleUrl: './my-properties.component.css'
})
export class MyPropertiesComponent {
  properties: Property[] = [];
  user;

  private readonly propertyService = inject(PropertyService);
  private readonly router = inject(Router);
  private readonly userService = inject(UserService);

  constructor(){
    this.user = this.userService.getUser()
  }

  ngOnInit(): void {
    this.propertyService.getUserProperties().subscribe(
      data => this.properties = data
    )
  }

  goToHouseDetail(propertyId: string) {
    this.router.navigate(['/show-property', propertyId]);
  }

  goToEditProperty(propertyId: string){
    this.router.navigate(['/edit-property', propertyId]);
  }

  deleteProperty(propertyId: string){
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Se eliminara la propiedad y todos sus detalles',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#2140AE',
      cancelButtonColor: '#ff3d3d',
      confirmButtonText: 'Yes',
    }).then(result => {
      if (result.isConfirmed) {
        try {
          this.propertyService.deleteProperty(propertyId)
          this.router.navigateByUrl('/my-properties')
        }
        catch (error) {
          Swal.fire({
            icon: 'error',
            title: 'Error interno',
            text: 'No se pudo eliminar la propiedad',
          });
        }
      }
    })
  }

  capitalizeFirstLetter(text:string) {
    return String(text).charAt(0).toUpperCase() + String(text).slice(1);
  }
}
