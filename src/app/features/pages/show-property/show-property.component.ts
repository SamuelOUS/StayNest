import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../interfaces/property.interface';
import { PropertyService } from '../../services/property.service';


@Component({
  selector: 'app-show-property',
  standalone: true, 
  imports: [CommonModule],
  templateUrl: './show-property.component.html',
  styleUrls: ['./show-property.component.css']
})
export class ShowPropertyComponent implements OnInit {

  property!: Property;

  constructor(private route: ActivatedRoute,private propertyService: PropertyService) {}

  ngOnInit(): void {
    const propertyId = this.route.snapshot.paramMap.get('id');
    this.propertyService.getProperty(propertyId!)
      .subscribe(property => this.property = property);   
  }
}
