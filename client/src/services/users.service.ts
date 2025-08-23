import { fetchApi } from "@/app/lib/fetchApi";
import { AuthResponse, LoginCredentials, User } from "@/types";

export const UsersService = {

  login: async (information: LoginCredentials): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/login`,
      {
        method: "POST",
        body: JSON.stringify(information),
      }
    );
  },

  register: async (values: User): Promise<AuthResponse> => {
    return fetchApi<AuthResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/register`,
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    );
  },

  getUsers: async (): Promise<User[]> => {
    return fetchApi<User[]>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
      {
        method: "GET",
        cache: "no-store",
      }
    );
  },

  createUser: async (values: User): Promise<User> => {
    return fetchApi<User>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    );
  },

  updateUser: async (values: Partial<User>, id: number): Promise<User> => {
    return fetchApi<User>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(values),
      }
    );
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    return fetchApi<{ message: string }>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
