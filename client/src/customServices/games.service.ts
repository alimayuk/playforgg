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

export interface Game {
    id: number;
    title: string;
    slug: string;
    locale: string;
    [key: string]: any;
}

export const GamesService = {
    getGames: async (
        locale: string = "tr",
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Game[]; status: boolean; meta?: any }> => {

        const queryLocale = locale && locale !== "hepsi" ? locale : "hepsi";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/games?locale=${queryLocale}&page=${page}&per_page=${per_page}`;

        const data = await fetchWithAuth<{ data: Game[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
            }
        );

        return data;
    },

    getGameById: async (id: number): Promise<Game> => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/games/${id}`;
        return fetchWithAuth<Game>(url, { method: "GET" });
    },
    createGame: async (blogData: Partial<Game>): Promise<Game> => {
        const isFormData = blogData instanceof FormData;
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/games`;
        return fetchWithAuth<Game>(url, {
            method: "POST",
            body: isFormData ? blogData : JSON.stringify(blogData),
        });
    },
    updateGame: async (id: number, blogData: Partial<Game>): Promise<Game> => {
        const isFormData = blogData instanceof FormData;
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/games/${id}`;
        return fetchWithAuth<Game>(url, {
            method: "POST",
            body: isFormData ? blogData : JSON.stringify(blogData),
        });
    },
    deleteGame: async (id: number): Promise<{ message: string }> => {
        const locale = getLocale();
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/games/${id}?locale=${locale}`;
        const response = await fetchWithAuth(url, {
            method: "DELETE",
        });
        return response.status;
    },
}