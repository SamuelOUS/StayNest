import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Property } from '../../interfaces/property.interface';
import { PropertyService } from '../../services/property.service';
import { SearchBarComponent } from '../search-bar/search-bar.component';

@Component({
  selector: 'app-house',
  standalone: true,
  imports: [CommonModule, SearchBarComponent, NgOptimizedImage],
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css'],
})
export class HouseComponent {
  allProperties: Property[] = [];
  properties = signal<Property[]>([]);

  private readonly router = inject(Router);
  private readonly propertyService = inject(PropertyService);

  ngOnInit() {
    this.propertyService.getProperties().subscribe(this.properties.set);
    this.allProperties = this.properties();
  }

  goToHouseDetail(propertyId: string) {
    this.router.navigate(['/show-property', propertyId]);
  }

  onSearch(search: { search: string; capacity: number | undefined }) {
    if (!search.capacity) search.capacity = 0;
    // Si no hay busqueda o filtro, muestre todas las propiedades
    if (!search.search && !search.capacity)
      this.properties.set(this.allProperties);
    else
      this.properties.set(
        this.allProperties.filter(property =>
            (property.title
              .toLowerCase()
              .includes(search.search.toLowerCase()) ||
              property.address
                .toLowerCase()
                .includes(search.search.toLowerCase())) &&
            property.capacity >= search.capacity!
        )
      );
  }

  capitalizeFirstLetter(text:string) {
    return String(text).charAt(0).toUpperCase() + String(text).slice(1);
  }
}
