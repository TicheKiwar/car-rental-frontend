import { User } from "./User";

export interface Client {
    clientId: number;
    dni: string;
    firstName: string;
    lastName: string;
    phone?: string;
    address?: string;
    user: User;
}