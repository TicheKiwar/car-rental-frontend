import { Position } from "./Position";
import { User } from "./User";

export interface Employee {
    employeeId: number;
    dni: string;
    firstName: string;
    lastName: string;
    phone: string;
    hireDate: string;
    salary: string;
    user: User;
    position: Position;
}