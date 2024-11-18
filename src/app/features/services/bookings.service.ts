import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookingsService {
  private apiUrl = 'http://localhost:3000/bookings'; // Cambia esto por la URL de tu API

  constructor(private http: HttpClient) {}

  /**
   * Obtiene las reservas de un usuario específico.
   * @param userId ID del usuario.
   * @returns Observable con las reservas.
   */
  getUserBookings(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/user/${userId}`);
  }
}
