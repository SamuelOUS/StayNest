import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../interfaces/property.interface';


@Component({
  selector: 'app-house',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.css'] 
})
export class HouseComponent {
   
  savedHouses: Property[] = [
    {
      id: 213,
      title: 'House 1',
      description: '4 bedrooms, 2 bathrooms',
      address: '123 Main Street',
      price: 100,
      images: [
        'https://izewtxtokzzhdxukxuog.supabase.co/storage/v1/object/public/StayNestImages/pipepalacio11/house3.webp',
        
      ],
    },
    {
      id: 823,
      title: 'House 2',
      description: '5 bedrooms, 3 bathrooms',
      address: '312 Main Street',
      price: 200,
      images: [
        'https://izewtxtokzzhdxukxuog.supabase.co/storage/v1/object/public/StayNestImages/pipepalacio11/house2.jpg',

      ],
    },
    {
      id: 943,
      title: 'House 3',
      description: '2 bedrooms, 1 bathroom',
      address: '2 Main Street',
      price: 50,
      images: [
        'https://izewtxtokzzhdxukxuog.supabase.co/storage/v1/object/public/StayNestImages/pipepalacio11/house1.jpg',

      ],
    },
  ]; 

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
