import { User } from "../../auth/interfaces/user.interface";

export interface Review{
    id?: string;
    user: Partial<User>;
    comment: string;
    createdAt: Date;

}
