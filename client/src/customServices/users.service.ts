import { getCookie } from "cookies-next";

interface User {
  id?: number;
  username: string;
  email: string;
  password?: string;
  password_confirmation?: string;
  // Dilersen role, phone gibi alanları da ekleyebilirsin
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
    const response = await fetch(url, { ...options, headers });
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
    const response = await fetch(url, { ...options, headers });
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
  // 🔐 Kullanıcı Girişi (Login)
  login: async (information: LoginCredentials): Promise<AuthResponse> => {
    console.log("Logging in with:", information);
    return fetchWithoutAuth<AuthResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/login`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(information),
      }
    );
  },

  // 🆕 Kullanıcı Kaydı (Register)
  register: async (values: User): Promise<AuthResponse> => {
    return fetchWithoutAuth<AuthResponse>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/register`,
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    );
  },

  // 📋 Tüm kullanıcıları getir
  getUsers: async (token?: string): Promise<User[]> => {
    return fetchWithAuth<User[]>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );
  },

  // ➕ Yeni kullanıcı oluştur
  createUser: async (values: User): Promise<User> => {
    return fetchWithAuth<User>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users`,
      {
        method: "POST",
        body: JSON.stringify(values),
      }
    );
  },

  // ✏️ Kullanıcı güncelle
  updateUser: async (values: Partial<User>, id: number): Promise<User> => {
    return fetchWithAuth<User>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`,
      {
        method: "PUT",
        body: JSON.stringify(values),
      }
    );
  },

  // ❌ Kullanıcı sil
  deleteUser: async (id: number): Promise<{ message: string }> => {
    return fetchWithAuth<{ message: string }>(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/users/${id}`,
      {
        method: "DELETE",
      }
    );
  },
};
