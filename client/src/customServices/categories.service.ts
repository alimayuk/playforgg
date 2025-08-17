import { fetchApi } from "@/app/lib/fetchApi";
import { getCookie } from "cookies-next";

const getLocale = (): string => {
    return getCookie("NEXT_LOCALE")?.toString() || "tr";
};

export interface Category {
    id: number;
    title: string;
    slug: string;
    locale: string;
    [key: string]: any;
}
export interface FeaturedCategories {
    id: number;
    title: string;
    slug: string;
    icon: string;
    image: string;
    locale: string;
    [key: string]: any;
}
export const CategoriesService = {

    getCategories: async (
        locale: string = "tr",
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Category[]; status: boolean; meta?: any }> => {

        const queryLocale = locale && locale !== "hepsi" ? locale : "hepsi";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/categories?locale=${queryLocale}&page=${page}&per_page=${per_page}`;

        const data = await fetchApi<{ data: Category[]; status: boolean; meta?: any }>(
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

        const data = await fetchApi<{ data: Category[] }>(url, {
            method: "GET",
            cache: "no-store",
            credentials: "include",
        });

        return data.data;
    },

    createCategory: async (values: Record<string, any>): Promise<{ data: Category }> => {

        const isFormData = values instanceof FormData;

        return fetchApi<{ data: Category }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/categories`,
            {
                method: "POST",
                body: isFormData ? values : JSON.stringify(values),
            }
        );
    },

    updateCategory: async (
        values: Record<string, any>,
        id: number
    ): Promise<{ data: Category }> => {
        const isFormData = values instanceof FormData;

        if (isFormData) {
            values.append("_method", "PUT");
        }

        return fetchApi<{ data: Category }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/categories/${id}`,
            {
                method: isFormData ? "POST" : "PUT",
                body: isFormData ? values : JSON.stringify(values),
            }
        );
    },

    deleteCategory: async (id: number): Promise<{ message: string }> => {
        const locale = getLocale();
        return fetchApi<{ message: string }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/categories/${id}?locale=${locale}`,
            {
                method: "DELETE",
            }
        );
    },
};
