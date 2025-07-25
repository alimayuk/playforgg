import { getCookie } from "cookies-next";

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

const getLocale = (): string => {
    return getCookie("NEXT_LOCALE")?.toString() || "tr"; // varsayılan tr
};

const fetchWithAuth = async <T = any>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    const headers: HeadersInit = {
        Accept: "application/json",
        "Content-Type": "application/json",
        credentials: "include", // Cookie gönderilsin
        ...options.headers,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: "include", // Cookie gönderilsin
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw errorData;
        }
        return await response.json();
    } catch (error) {
        throw error;
    }
};



export interface Category {
    id: number;
    title: string;
    slug: string;
    locale: string;
    [key: string]: any;
}

export const CategoriesService = {
    getCategories: async (): Promise<{ data: Category[]; status: boolean }> => {
        const locale = getLocale();
        const data = await fetchWithAuth<Category[]>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/categories?locale=${locale}`,
            {
                method: "GET",
                cache: "no-store",
                credentials: "include",
            }
        );

        return {
            data,
            status: true,
        };
    },

    createCategory: async (values: Record<string, any>): Promise<Category> => {
        const locale = getLocale();
        return fetchWithAuth<Category>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/categories`,
            {
                method: "POST",
                body: JSON.stringify({ ...values, locale }),
            }
        );
    },

    updateCategory: async (
        values: Record<string, any>,
        id: number
    ): Promise<Category> => {
        const locale = getLocale();
        return fetchWithAuth<Category>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/categories/${id}`,
            {
                method: "PUT",
                body: JSON.stringify({ ...values, locale }),
            }
        );
    },

    deleteCategory: async (id: number): Promise<{ message: string }> => {
        const locale = getLocale();
        return fetchWithAuth<{ message: string }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/categories/${id}?locale=${locale}`,
            {
                method: "DELETE",
            }
        );
    },
};
