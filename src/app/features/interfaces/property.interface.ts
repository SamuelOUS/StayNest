import { Photo} from "./photo.interface";
import { Review } from "./review.interface";
import { User } from "../../auth/interfaces/user.interface";

export interface Property {
    id?: number;
    title: string;
    address: string;
    pricePerNight: number;
    photos: Partial<Photo[]>;
    capacity:number;
    description?: string;
    bedrooms?: number;
    bathrooms?: number;
    reviews?: Review[];
    user?: Partial<User>;
  }