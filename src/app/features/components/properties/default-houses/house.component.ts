import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreatePropertiesService } from '../create-properties/services/create-properties.service';

interface Property {
  id: number;
  tittle: string;
  description: string;
  address: string;
  price: number;
  images: string[];
}

@Component({
  selector: 'app-house',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css'] // Corrige a styleUrls
})
export class HouseComponent {
   
  savedHouses: Property[] = []; // Especifica el tipo aquí

  constructor(private router: Router) {}

  ngOnInit() {
    const savedHouseData = localStorage.getItem('properties');
    if (savedHouseData) {
      this.savedHouses = JSON.parse(savedHouseData);
    }
  }

  goToHouseDetail(houseId: number) {
    this.router.navigate(['/show-property', houseId]); // Redirige a la ruta con el ID de la propiedad
  }
  
}
