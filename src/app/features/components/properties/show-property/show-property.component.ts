import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../interfaces/property.interface';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-show-property',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './show-property.component.html',
  styleUrls: ['./show-property.component.css']
})
export class ShowPropertyComponent implements OnInit {

  property: Property | undefined;

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      if (typeof window !== 'undefined' && window.localStorage){
        const properties: Property[] = JSON.parse(localStorage.getItem('properties') || '[]');
        this.property = properties.find(prop => prop.id === +propertyId);
        console.log(this.property)
      }
    }
  }
}
