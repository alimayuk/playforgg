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
    
    const headers = new Headers(options.headers);

    
    if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

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

export interface Article {
    id: number;
    title: string;
    slug: string;
    locale: string;
    [key: string]: any;
}

export const ArticlesService = {

    getArticles: async (
        locale: string = "tr",
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Article[]; status: boolean; meta?: any }> => {
        
        const queryLocale = locale && locale !== "hepsi" ? locale : "hepsi";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/articles?locale=${queryLocale}&page=${page}&per_page=${per_page}`;

        const data = await fetchWithAuth<{ data: Article[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
                cache: "no-store",
                credentials: "include",
            }
        );

        return data;
    },

    getAllByLocale: async (locale: string): Promise<Article[]> => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/articles?locale=${locale}&per_page=9999`;

        const data = await fetchWithAuth<{ data: Article[] }>(url, {
            method: "GET",
            cache: "no-store",
            credentials: "include",
        });

        return data.data;
    },

    createArticle: async (values: Record<string, any>): Promise<{ data: Article }> => {
        
        const isFormData = values instanceof FormData;

        return fetchWithAuth<{ data: Article }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/articles`,
            {
                method: "POST",
                body: isFormData ? values : JSON.stringify(values),
            }
        );
    },

    updateArticle: async (
        values: Record<string, any>,
        id: number
    ): Promise<{ data: Article }> => {
        const isFormData = values instanceof FormData;

        if (isFormData) {
            values.append("_method", "PUT"); 
        }

        return fetchWithAuth<{ data: Article }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/articles/${id}`,
            {
                method: isFormData ? "POST" : "PUT",
                body: isFormData ? values : JSON.stringify(values),
            }
        );
    },

    deleteArticle: async (id: number): Promise<{ message: string }> => {
        const locale = getLocale();
        return fetchWithAuth<{ message: string }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/articles/${id}?locale=${locale}`,
            {
                method: "DELETE",
            }
        );
    },
};
