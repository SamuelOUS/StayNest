import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Property } from '../../interfaces/property.interface';
import { PropertyService } from '../../services/property.service';
import { FormsModule } from '@angular/forms';
import { Review } from '../../interfaces/review.interface';
import { UserService } from '../../../auth/services/user.service';
import Swal from 'sweetalert2';
import { StarComponent } from '../../components/star/star.component';
import { BookingsService } from '../../services/bookings.service';
import { LogInComponent } from '../../../auth/components/log-in/log-in.component';
import { ModalService } from '../../../services/modal.service';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-show-property',
  standalone: true,
  imports: [CommonModule, FormsModule, StarComponent],
  templateUrl: './show-property.component.html',
  styleUrls: ['./show-property.component.css'],
})
export class ShowPropertyComponent implements OnInit {
  property!: Property;
  newReviewComment: string = '';
  newRating: number = 5;
  propertyId: string = '';
  isModalOpen: boolean = false; // Controla la visibilidad del modal
  selectedStartDate!: string; // Almacena la fecha de inicio
  selectedEndDate!: string; // Almacena la fecha de fin

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
    private userService: UserService,
    private bookingsService: BookingsService,
    private modalService: ModalService
  ) {}

  ngOnInit(): void {
    this.propertyId = this.route.snapshot.paramMap.get('id')!;
    this.propertyService.getProperty(this.propertyId).subscribe((property) => {
      this.property = property;
    });
  }

  openModal(): void {
    if (this.userService.getUser()().username) this.isModalOpen = true;
    else this.modalService.openModal<LogInComponent, null>(LogInComponent);
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  submitReservation(): void {
    if (!this.selectedStartDate && !this.selectedEndDate) {
      Swal.fire({
        icon: 'error',
        text: 'Por favor selecciona las fechas de inicio y fin.',
      });
      return;
    }

    const start = new Date(this.selectedStartDate);
    const end = new Date(this.selectedEndDate);
    if (start > end) {
      Swal.fire({
        icon: 'error',
        text: 'La fecha de inicio no puede ser posterior a la fecha de fin.',
      });
      this.closeModal();
      return;
    }

    const differenceInMilliseconds = end.getTime() - start.getTime();
    const differenceInDays = differenceInMilliseconds / (1000 * 60 * 60 * 24);
    const totalPrice = differenceInDays * this.property.pricePerNight;

    this.bookingsService
      .createBooking({
        propertyId: this.propertyId,
        startDate: start,
        endDate: end,
        totalPrice,
      })
      .pipe(
        catchError((err) =>
          throwError(() => {
            Swal.fire({
              icon: 'error',
              text: 'No se pudo realizar la reserva',
            });
            return;
          })
        )
      )
      .subscribe((data) => {
        Swal.fire({
          icon: 'success',
          text: `Reserva realizada del ${this.selectedStartDate} al ${this.selectedEndDate}. Total a pagar: ${totalPrice}`,
        });
      });
    this.closeModal();
  }

  addReview(): void {
    if (this.newReviewComment.trim()) {
      const newReview: Review = {
        propertyId: this.propertyId,
        rating: this.newRating,
        comment: this.newReviewComment,
        createdAt: new Date(Date.now()),
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
        Swal.fire({
          icon: 'error',
          text: 'No se pudo agregar el comentario',
        });
      }
    }
  }
}
