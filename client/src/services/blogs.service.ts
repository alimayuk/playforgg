import { fetchApi } from "@/app/lib/fetchApi";
import { Blog } from "@/types";
import { getLocale } from "@/utils/localeUtils";

const locale = getLocale();

export const BlogsService = {
    getBlogs: async (
        locale: string = "tr",
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Blog[]; status: boolean; meta?: any }> => {

        const queryLocale = locale && locale !== "hepsi" ? locale : "hepsi";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs?locale=${queryLocale}&page=${page}&per_page=${per_page}`;

        const data = await fetchApi<{ data: Blog[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
            }
        );

        return data;
    },

    getBlogById: async (id: number): Promise<Blog> => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`;
        return fetchApi<Blog>(url, { method: "GET" });
    },
    createBlog: async (blogData: Partial<Blog>): Promise<Blog> => {
        const isFormData = blogData instanceof FormData;
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs`;
        return fetchApi<Blog>(url, {
            method: "POST",
            body: isFormData ? blogData : JSON.stringify(blogData),
        });
    },
    updateBlog: async (id: number, blogData: Partial<Blog>): Promise<Blog> => {
        const isFormData = blogData instanceof FormData;
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}`;
        return fetchApi<Blog>(url, {
            method: "POST",
            body: isFormData ? blogData : JSON.stringify(blogData),
        });
    },
    deleteBlog: async (id: number): Promise<{ message: string }> => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${id}?locale=${locale}`;
        const response = await fetchApi(url, {
            method: "DELETE",
        });
        return response.status;
    },
}