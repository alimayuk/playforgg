import { getCookie } from "cookies-next";

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

const getLocale = (): string => {
    return getCookie("NEXT_LOCALE")?.toString() || "tr";
};

const fetchWithAuth = async <T = any>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    const headers: HeadersInit = {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...options.headers,
    };

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
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
    getCategories: async (
        locale: string = "tr",
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Category[]; status: boolean; meta?: any }> => {
        const queryLocale = locale && locale !== "hepsi" ? `${locale}&` : "hepsi&";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/categories?locale=${queryLocale}page=${page}&per_page=${per_page}`;

        const data = await fetchWithAuth<{ data: Category[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
                cache: "no-store",
                credentials: "include",
            }
        );

        return data;
    },

    getAllByLocale: async (locale: string): Promise<Category[]> => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/categories?locale=${locale}&per_page=9999`;

        const data = await fetchWithAuth<{ data: Category[] }>(url, {
            method: "GET",
            cache: "no-store",
            credentials: "include",
        });

        return data.data;
    },

    createCategory: async (values: Record<string, any>): Promise<{ data: Category }> => {
        return fetchWithAuth<{ data: Category }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/categories`,
            {
                method: "POST",
                body: JSON.stringify({ ...values}),
            }
        );
    },

    updateCategory: async (
        values: Record<string, any>,
        id: number
    ): Promise<{ data: Category }> => {
        return fetchWithAuth<{ data: Category }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/categories/${id}`,
            {
                method: "PUT",
                body: JSON.stringify({ ...values}),
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

