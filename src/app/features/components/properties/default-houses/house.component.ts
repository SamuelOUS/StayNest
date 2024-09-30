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
  styleUrls: ['./house.component.css'] 
})
export class HouseComponent {
   
  savedHouses: Property[] = []; 

  constructor(private router: Router) {}

  ngOnInit() {
    if (typeof window !== 'undefined' && window.localStorage) {
      const savedHouseData = localStorage.getItem('properties');
      if (savedHouseData) {
        this.savedHouses = JSON.parse(savedHouseData);
      }
    }
  }

  goToHouseDetail(houseId: number) {
    this.router.navigate(['/show-property', houseId]); 
  }
  
}
