import { User } from "../../auth/interfaces/user.interface";

export interface Review{
    id?: string;
    user?: Partial<User>;
    propertyId?:string;
    comment: string;
    rating: number;
    createdAt: Date;
}
