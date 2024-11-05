import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../interfaces/property.interface';
import { PropertyService } from '../../services/property.service';


@Component({
  selector: 'app-house',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css'] 
})
export class HouseComponent {
  properties = signal<Property[]>([]);

  private readonly router = inject(Router)
  private readonly propertyService = inject(PropertyService);


  ngOnInit() {
    this.propertyService.getProperties().subscribe(this.properties.set)
  }

  goToHouseDetail(houseId: number) {
    this.router.navigate(['/show-property', houseId]); 
  }
  
}
