import { Component, inject, OnInit } from '@angular/core';
import { BookingsService } from '../../services/bookings.service';
import { CommonModule } from '@angular/common'; 
import { Booking } from '../../interfaces/booking.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-my-bookings',
  standalone: true, 
  imports: [CommonModule], 
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];

  private readonly bookingsService = inject(BookingsService);
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.bookingsService.getUserBookings().subscribe(
      data => this.bookings = data
    )
  }

  goToPropertyDetail(propertyId: string) {
    this.router.navigate(['/show-property', propertyId]);
  }
}
