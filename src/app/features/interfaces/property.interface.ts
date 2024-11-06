import { Photo } from "./photo.interface";

export interface Property {
    id?: number;
    title: string;
    address: string;
    pricePerNight: number;
    photos: Photo[]
    description?: string;
    capacity?:number;
    bedrooms?: number;
    bathrooms?: number;
  }