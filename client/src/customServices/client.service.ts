import { getCookie } from "cookies-next";
import { ForumTopic } from "./forms.service";

interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

export interface Blog {
    id: number;
    title: string;
    slug: string;
    locale: string;
    [key: string]: any;
}

const getLocale = (): string => {
    return getCookie("NEXT_LOCALE")?.toString() || "tr";
};

const fetchWithAuth = async <T = any>(
    url: string,
    options: RequestInit = {}
): Promise<T> => {
    const headers = new Headers(options.headers);

    // FormData değilse JSON olduğunu varsayalım
    if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    try {
        const response = await fetch(url, {
            ...options,
            headers,
            credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data?.message || "İşlem başarısız.");
        }

        return data;
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
        throw error; ""
    }
};

export const ClientService = {

    getBlogs: async (
        locale: string = 'tr',
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Blog[]; status: boolean; meta?: any }> => {
        const queryLocale = locale && locale !== "hepsi" ? locale : "hepsi";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/client/blogs?locale=${queryLocale}&page=${page}&per_page=${per_page}`;
        const data = await fetchWithoutAuth<{ data: Blog[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
            }
        );

        return data;
    },

    getArticles: async (
        locale: string = 'tr',
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Blog[]; status: boolean; meta?: any }> => {
        const queryLocale = locale && locale !== "hepsi" ? locale : "hepsi";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/client/articles?locale=${queryLocale}&page=${page}&per_page=${per_page}`;
        const data = await fetchWithoutAuth<{ data: Blog[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
            }
        );

        return data;
    },

    getAllTopicsClient: async (): Promise<ForumTopic[]> => {
        return fetchWithAuth<ForumTopic[]>(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/forums`);
    },

    getTopicClient: async (id: number): Promise<ForumTopic> => {
        return fetchWithAuth<ForumTopic>(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/forums/${id}`);
    },
};
