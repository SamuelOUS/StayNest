import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../interfaces/property.interface';
import { PropertyService } from '../../services/property.service';
import { FormsModule } from '@angular/forms';
import { Review } from '../../interfaces/review.interface';
import { UserService } from '../../../auth/services/user.service';
import Swal from 'sweetalert2';
import { StarComponent } from "../../components/star/star.component";


@Component({
  selector: 'app-show-property',
  standalone: true, 
  imports: [CommonModule, FormsModule, StarComponent],
  templateUrl: './show-property.component.html',
  styleUrls: ['./show-property.component.css']
})
export class ShowPropertyComponent implements OnInit {

  property!: Property;
  newReviewComment: string = '';
  newRating: number = 5;
  propertyId: string = '';

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;
    this.propertyService.getProperty(this.propertyId)
      .subscribe(property => this.property = property);   
  }

  addReview(): void {
    if (this.newReviewComment.trim()) {
      const newReview:Review = {
        propertyId: this.propertyId,
        rating: this.newRating!,
        comment: this.newReviewComment,
        createdAt: new Date(Date.now())
      };
      try {
        this.propertyService.addReview(newReview).subscribe(
          review => {
            review.user = this.userService.getUser()()
            this.property.reviews!.push(review)
            this.newReviewComment = '';
          }
        );
      } catch (error) {
        Swal.fire({
          icon:'error',
          text: 'No se pudo agregar el comentario'
        })
      }
      

    }
  }
}
