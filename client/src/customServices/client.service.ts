import { getCookie } from "cookies-next";
import { ForumTopic } from "./forms.service";
import { fetchApi } from "@/app/lib/fetchApi";

const getLocale = (): string => {
    return getCookie("NEXT_LOCALE")?.toString() || "tr";
};

export interface Blog {
    id: number;
    title: string;
    slug: string;
    locale: string;
    [key: string]: any;
}

export interface HomePageData {
    blogs: Blog[];
    games: Game[];
    categories: Category[];
    status: string;
}

export interface Game {
    id: number;
    title: string;
    slug: string;
    image: string;
    // diğer özellikler...
}

export interface Category {
    id: number;
    title: string;
    slug: string;
}

interface ForumTopicsResponse {
    data: ForumTopic[];
    categories?: any[];
    meta?: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
    };
    status?: string;
}

interface ForumTopicsParams {
    page?: number;
    per_page?: number;
    category?: string;
    locale?: string;
}
interface ForumTopicDetail {
    id: number;
    title: string;
    content: string;
    slug: string;
    views: number;
    created_at: string;
    comments_count: number;
    likes_count: number;
    user: {
        id: number;
        username: string;
    };
    category: {
        id: number;
        title: string;
        slug: string;
    };
    comments: Array<{
        id: number;
        content: string;
        created_at: string;
        user: {
            id: number;
            username: string;
        };
        replies: Array<{
            id: number;
            content: string;
            created_at: string;
            user: {
                id: number;
                username: string;
            };
        }>;
    }>;
}
export const ClientService = {

    getHomePageData: async (): Promise<HomePageData> => {
        const locale = getLocale();
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
            locale = getLocale()
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

    getTopicClient: async (slug: string): Promise<ForumTopicDetail> => {
        return fetchApi<ForumTopicDetail>(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/forums/${slug}`);
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
