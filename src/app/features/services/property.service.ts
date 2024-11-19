import { Injectable } from '@angular/core';
import { Property } from '../interfaces/property.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Review } from '../interfaces/review.interface';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  constructor(private http: HttpClient) {}

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>('http://localhost:3000/api/properties');
  }

  getProperty(propertyId: string): Observable<Property> {
    return this.http.get<Property>(
      `http://localhost:3000/api/properties/${propertyId}`
    );
  }

  getUserProperties(): Observable<Property[]>{
    return this.http.get<Property[]>(
      'http://localhost:3000/api/properties/user', this.getHeaders()
    );
  }

  createProperty(property: Property) {
    return this.http
      .post('http://localhost:3000/api/properties', property, this.getHeaders())
      .pipe(tap())
      .subscribe();
  }

  updateProperty(propertyId:string, property: Property) {
    return this.http.patch(
      `http://localhost:3000/api/properties/${propertyId}`, property, this.getHeaders()
    ).subscribe(result => {
      if (!result) throw new Error
    })
  }

  deleteProperty(propertyId: string){
    return this.http.delete(
      `http://localhost:3000/api/properties/${propertyId}`,
      this.getHeaders()
    ).subscribe(result => {
      if (!result) throw new Error
    })
  }

  addReview(review: Review): Observable<Review> {
    return this.http.post<Review>(
      'http://localhost:3000/api/properties/review',
      review,
      this.getHeaders()
    );
  }

  private getHeaders() {
    const token = sessionStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`,
      }),
    };
  }
}
