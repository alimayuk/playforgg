export interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

export const fetchApi = async <T = any>(
    url: string,
    options: FetchOptions & { skipAuth?: boolean } = {}
): Promise<T> => {
    const headers = new Headers(options.headers);

    if (!headers.has("Accept")) {
        headers.set("Accept", "application/json");
    }
    if (options.body && !(options.body instanceof FormData) && !headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    if (response.status === 401 && !options.skipAuth) {
        document.cookie = 'token=; Max-Age=0; path=/';
        throw new Error("SESSION_EXPIRED");
    }

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw errorData;
    }

    return response.json();
};
