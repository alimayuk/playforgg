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

export interface Blog {
    id: number;
    title: string;
    slug: string;
    locale: string;
    [key: string]: any;
}

export const BlogsService = {
    getBlogs: async (
        locale: string = "tr",
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Blog[]; status: boolean; meta?: any }> => {

        const queryLocale = locale && locale !== "hepsi" ? locale : "hepsi";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs?locale=${queryLocale}&page=${page}&per_page=${per_page}`;

        const data = await fetchWithAuth<{ data: Blog[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
            }
        );

        return data;
    },

    getBlogById: async (id: number): Promise<Blog> => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`;
        return fetchWithAuth<Blog>(url, { method: "GET" });
    },
    createBlog: async (blogData: Partial<Blog>): Promise<Blog> => {
        const isFormData = blogData instanceof FormData;
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs`;
        return fetchWithAuth<Blog>(url, {
            method: "POST",
            body: isFormData ? blogData : JSON.stringify(blogData),
        });
    },
    updateBlog: async (id: number, blogData: Partial<Blog>): Promise<Blog> => {
        const isFormData = blogData instanceof FormData;
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`;
        return fetchWithAuth<Blog>(url, {
            method: "POST",
            body: isFormData ? blogData : JSON.stringify(blogData),
        });
    },
    deleteBlog: async (id: number): Promise<{ message: string }> => {
        const locale = getLocale();
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}?locale=${locale}`;
        const response = await fetchWithAuth(url, {
            method: "DELETE",
        });
        return response.status;
    },
}