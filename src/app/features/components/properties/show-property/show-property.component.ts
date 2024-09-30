import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

interface Property {
  id: number;
  tittle: string;
  description: string;
  address: string;
  price: number;
  images: string[];
}

@Component({
  selector: 'app-show-property',
  templateUrl: './show-property.component.html',
  styleUrls: ['./show-property.component.css']
})
export class ShowPropertyComponent implements OnInit {

  property: Property | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    
    const propertyId = this.route.snapshot.paramMap.get('id');
    
    if (propertyId) {
     
      const properties: Property[] = JSON.parse(localStorage.getItem('properties') || '[]');
      
      this.property = properties.find(prop => prop.id === +propertyId);
    }
  }
}
