import { User } from "./user";

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    status: string;
    token: string;
    user?: User;
    message?: string;
}