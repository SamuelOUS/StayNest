import { Property } from "./property.interface";

export interface Booking{
    id?: number;
    propertyId?: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    property?: Partial<Property>
}