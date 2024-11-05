import { Injectable } from '@angular/core';
import { Property } from '../interfaces/property.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private http: HttpClient) { }

  getProperties(): Observable<Property[]> {
    return this.http.get<Property[]>('http://localhost:3000/api/properties');
  }
}
