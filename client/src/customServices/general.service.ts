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

export const GeneralService = {

    toggleField: async (
        model: "category" | "blog" | "product" | "game" | "article",
        id: number,
        field: "status" | "featured"
    ): Promise<any> => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/toggle-field/${model}/${id}?field=${field}`;

        return fetchWithAuth(url, {
            method: "PUT",
        });
    },
};
