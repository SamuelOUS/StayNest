import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../interfaces/property.interface';


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

    //ToDo: Conectar el componente con el propertyService y
    //ToDo: conectar la vista con los atributos correctos y mejorarla

    const propertyId = this.route.snapshot.paramMap.get('id');
    if (propertyId) {
      if (typeof window !== 'undefined' && window.localStorage){
        const properties: Property[] = JSON.parse(localStorage.getItem('properties') || '[]');
        this.property = properties.find(prop => prop.id === +propertyId);
      }
    }
  }
}
