import { getCookie } from "cookies-next";

interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
}

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  status: string;
  token: string;
  user?: User;
}

const fetchWithAuth = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const token = getCookie("token");
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers, credentials: "include" });
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

const fetchWithoutAuth = async <T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  const headers = {
    Accept: "application/json",
    "Content-Type": "application/json",
    ...options.headers,
  };

  try {
    const response = await fetch(url, { ...options, headers, credentials: "include" });
    if (!response.ok) {
      const errorData = await response.json();
      throw errorData;
    }
    return await response.json();
  } catch (error) {
    throw error;
  }
};

export const UsersService = {

  login: async (information: LoginCredentials): Promise<AuthResponse> => {
    return fetchWithoutAuth<AuthResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/login`,
      {
        method: "POST",
        body: JSON.stringify(information),
      }
    );
  },

  register: async (values: User): Promise<AuthResponse> => {
    return fetchWithoutAuth<AuthResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/register`,
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    );
  },

  getUsers: async (token?: string): Promise<User[]> => {
    return fetchWithAuth<User[]>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        }, // gereksiz çünkü zaten cookie ile gönderiliyor
        cache: "no-store",
      }
    );
  },

  createUser: async (values: User): Promise<User> => {
    return fetchWithAuth<User>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    );
  },

  updateUser: async (values: Partial<User>, id: number): Promise<User> => {
    return fetchWithAuth<User>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(values),
      }
    );
  },

  deleteUser: async (id: number): Promise<{ message: string }> => {
    return fetchWithAuth<{ message: string }>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
