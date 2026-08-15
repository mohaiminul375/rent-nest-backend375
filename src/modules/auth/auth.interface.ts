import { UserRole, UserStatus } from "../../../generated/prisma/enums";

export interface ICreateUser {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    address?: string;
}


export interface IUserLogin {
    email: string;
    password: string;
}