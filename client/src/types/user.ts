import { BaseEntity } from "./common/base";

export interface User extends BaseEntity {
    username: string;
    email: string;
}

export interface RegisterCredentials {
    username: string;
    email: string;
    password: string;
    password_confirmation: string;
}

export interface ClientUser {
    id: number;
    username: string;
    email?: string;
    created_at?: string;
    roles?: string[];
};