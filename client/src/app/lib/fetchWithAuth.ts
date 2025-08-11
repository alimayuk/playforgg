export interface FetchOptions extends RequestInit {
    headers?: HeadersInit;
}

export const fetchWithAuth = async <T = any>(
    url: string,
    options: FetchOptions = {}
): Promise<T> => {
    const headers = new Headers(options.headers);

    if (options.body && !(options.body instanceof FormData)) {
        headers.set("Content-Type", "application/json");
    }

    const response = await fetch(url, {
        ...options,
        headers,
        credentials: "include",
    });

    if (response.status === 401) {
        document.cookie = 'c=; Max-Age=0; path=/';
        document.cookie = 'token=; Max-Age=0; path=/';
        window.location.href = '/login';
        throw new Error("Unauthorized");
    }

    if (!response.ok) {
        const errorData = await response.json();
        throw errorData;
    }

    return await response.json();
};
