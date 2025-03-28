import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Booking } from '../interfaces/booking.interface';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {

  constructor(private readonly http: HttpClient) {}

  /**
   * Obtiene las reservas de un usuario específico por el token guardado en el sessionStorage.
   * @returns Observable con las reservas.
   */
  getUserBookings(): Observable<Booking[]> {
    return this.http.get<Booking[]>('http://localhost:3000/api/bookings', this.getHeaders())
  }

  createBooking(booking:Booking){
    console.log(booking)
    return this.http
      .post<Booking>('http://localhost:3000/api/bookings', booking, this.getHeaders())

  }

  private getHeaders(){
    const token = sessionStorage.getItem('token') ?? '';
    return {
      headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
      })
    }
  }
}
