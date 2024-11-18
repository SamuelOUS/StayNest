import { Component, inject, OnInit } from '@angular/core';
import { BookingsService } from '../../services/bookings.service';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 

@Component({
  selector: 'app-my-bookings',
  standalone: true, 
  imports: [CommonModule, RouterLink, HttpClientModule], 
  templateUrl: './my-bookings.component.html',
  styleUrls: ['./my-bookings.component.css']
})
export class MyBookingsComponent implements OnInit {
  bookings: any[] = [];
  userId = 'USER_ID'; 

  private readonly bookingsService = inject(BookingsService);

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingsService.getUserBookings(this.userId).subscribe(
      (data) => (this.bookings = data),
      (error) => console.error('Error al obtener las reservas:', error)
    );
  }
}
