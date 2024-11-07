import { Photo } from "./photo.interface";

export interface Property {
    id?: number;
    title: string;
    address: string;
    pricePerNight: number;
    photos: Photo[]
    capacity:number;
    description?: string;
    bedrooms?: number;
    bathrooms?: number;
  }