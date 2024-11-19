import { Component, inject, OnInit } from '@angular/core';
import { BookingsService } from '../../services/bookings.service';
import { CommonModule } from '@angular/common'; 
import { RouterLink } from '@angular/router';
import { HttpClientModule } from '@angular/common/http'; 
import { Booking } from '../../interfaces/booking.interface';
import { UserService } from '../../../auth/services/user.service';
import Swal from 'sweetalert2';

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

  ngOnInit(): void {
    this.bookingsService.getUserBookings().subscribe(
      (data) => {
        console.log("data: ",data)
        this.bookings = data
      }
    )
  }
}
