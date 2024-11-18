import { Injectable } from '@angular/core';
import { Property } from '../interfaces/property.interface';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private http: HttpClient) { }

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>('http://localhost:3000/api/properties');
  }

  getProperty(propertyId:string): Observable<Property> {
    return this.http.get<Property>(`http://localhost:3000/api/properties/${propertyId}`);
  }

  createProperty(property:Property){
    return this.http
      .post('http://localhost:3000/api/properties', property, this.getHeaders())
      .pipe(tap()).subscribe();
  }

  private getHeaders(){
    const token = sessionStorage.getItem('token') || '';
    return {
      headers: new HttpHeaders({
          Authorization: `Bearer ${token}`,
      })
    }
  }
}
