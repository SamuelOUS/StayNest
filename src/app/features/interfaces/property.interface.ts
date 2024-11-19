import { Photo} from "./photo.interface";
import { Review } from "./review.interface";
import { User } from "../../auth/interfaces/user.interface";

export interface Property {
    id?: string;
    title: string;
    address: string;
    pricePerNight: number;
    photos: Photo[];
    capacity:number;
    description?: string;
    bedrooms?: number;
    bathrooms?: number;
    reviews?: Review[];
    user?: Partial<User>;
  }