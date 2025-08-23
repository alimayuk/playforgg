import { fetchApi } from "@/app/lib/fetchApi";
import { Blog } from "@/types/blog";
import { ForumTopicDetail, ForumTopicsParams, ForumTopicsResponse, HomePageData } from "@/types";
import { getLocale } from "@/utils/localeUtils";

const locale = getLocale();
export const ClientService = {

    getHomePageData: async (): Promise<HomePageData> => {
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/client/home?locale=${locale}`;

        const response = await fetchApi<HomePageData>(url, { skipAuth: true });
        return response;
    },

    getBlogs: async (
        locale: string = 'tr',
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Blog[]; status: boolean; meta?: any }> => {
        const queryLocale = locale && locale !== "hepsi" ? locale : "hepsi";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/client/blogs?locale=${queryLocale}&page=${page}&per_page=${per_page}`;
        const data = await fetchApi<{ data: Blog[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
                skipAuth: true
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
        const data = await fetchApi<{ data: Blog[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
                skipAuth: true,
            }
        );

        return data;
    },

    getAllTopicsClient: async (
        params: ForumTopicsParams = {}
    ): Promise<ForumTopicsResponse> => {
        const {
            page = 1,
            per_page = 5,
            category = '',
        } = params;

        const queryParams = new URLSearchParams();
        queryParams.append('locale', locale);
        queryParams.append('page', page.toString());
        queryParams.append('per_page', per_page.toString());
        if (category) queryParams.append('category', category);

        return fetchApi<ForumTopicsResponse>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/client/forums?${queryParams.toString()}`
        );
    },

    getTopicClient: async (slug: string): Promise<{ data: ForumTopicDetail }> => {
        return fetchApi<{ data: ForumTopicDetail }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/client/forums/${slug}`
        );
    },

    getGames: async (
        locale: string = 'tr',
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: Blog[]; status: boolean; meta?: any }> => {
        const queryLocale = locale && locale !== "hepsi" ? locale : "hepsi";
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/client/games?locale=${queryLocale}&page=${page}&per_page=${per_page}`;
        const data = await fetchApi<{ data: Blog[]; status: boolean; meta?: any }>(
            url,
            {
                method: "GET",
            }
        );

        return data;
    },
};
