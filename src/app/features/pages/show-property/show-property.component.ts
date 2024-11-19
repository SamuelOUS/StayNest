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
  property: Property = {
    title: '',
    address: '',
    description: '',
    bedrooms: 0,
    bathrooms: 0,
    capacity: 0,
    pricePerNight: 0,
    photos: [],
    reviews: [],
    user: {
      profilePicture: '',
      name: '',
      email: '',
    }
  };
  newReviewComment: string = '';
  newRating: number = 5; // Inicia con un valor válido
  propertyId: string = '';
  isModalOpen: boolean = false; // Controla la visibilidad del modal
  selectedStartDate!: string; // Almacena la fecha de inicio
  selectedEndDate!: string; // Almacena la fecha de fin

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;
    this.propertyService.getProperty(this.propertyId).subscribe((property) => {
      this.property = property || this.getDefaultProperty();
    });
  }

  private getDefaultProperty(): Property {
    return {
      title: '',
      address: '',
      description: '',
      bedrooms: 0,
      bathrooms: 0,
      capacity: 0,
      pricePerNight: 0,
      photos: [],
      reviews: [],
      user: {
        profilePicture: '',
        name: '',
        email: '',
      }
    };
  }

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submitReservation(): void {
    if (this.selectedStartDate && this.selectedEndDate) {
      const start = new Date(this.selectedStartDate);
      const end = new Date(this.selectedEndDate);

      // Verificar si la fecha de inicio es anterior a la fecha de fin
      if (start <= end) {
        Swal.fire({
          icon: 'success',
          text: `Reserva realizada del ${this.selectedStartDate} al ${this.selectedEndDate}`
        });
        this.closeModal();
      } else {
        Swal.fire({
          icon: 'error',
          text: 'La fecha de inicio no puede ser posterior a la fecha de fin.'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        text: 'Por favor selecciona las fechas de inicio y fin.'
      });
    }
  }

  addReview(): void {
    if (this.newReviewComment.trim()) {
      const newReview: Review = {
        propertyId: this.propertyId,
        rating: this.newRating || 5, // Usa valor por defecto si newRating es undefined
        comment: this.newReviewComment,
        createdAt: new Date(Date.now())
      };
      try {
        this.propertyService.addReview(newReview).subscribe((review) => {
          review.user = this.userService.getUser()();
          if (this.property.reviews) {
            this.property.reviews.push(review);
          }
          this.newReviewComment = '';
        });
      } catch (error) {
        console.error('Error adding review:', error);
        Swal.fire({
          icon: 'error',
          text: 'No se pudo agregar el comentario'
        });
      }
    }
  }
}
