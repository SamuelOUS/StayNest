import { Component, inject } from '@angular/core';
import { Property } from '../../interfaces/property.interface';
import { PropertyService } from '../../services/property.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './my-properties.component.html',
  styleUrl: './my-properties.component.css'
})
export class MyPropertiesComponent {
  properties: Property[] = [];

  private readonly propertyService = inject(PropertyService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.propertyService.getUserProperties().subscribe(
      (data) => {
        console.log("data: ",data)
        this.properties = data
      }
    )
  }

  goToHouseDetail(propertyId: string) {
    this.router.navigate(['/show-property', propertyId]);
  }

  capitalizeFirstLetter(text:string) {
    return String(text).charAt(0).toUpperCase() + String(text).slice(1);
  }
}
