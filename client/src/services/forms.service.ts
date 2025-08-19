import { fetchApi } from "@/app/lib/fetchApi";

export interface ForumTopic {
    id: number;
    author_id: number;
    title: string;
    slug: string;
    content: string;
    category_id?: number | null;
    status: boolean;
    views: number;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface ForumComment {
    id: number;
    topic_id: number;
    author_id: number;
    message: string;
    parent_id?: number | null;
    created_at: string;
    updated_at: string;
    [key: string]: any;
}

export interface ForumComment {
    id: number;
    user: { id: number; username: string };
    message: string;
    date: string; // created_at gibi
    replies: ForumComment[];
}

export interface ForumTopicDetail {
    id: number;
    user: { id: number; username: string };
    title: string;
    content: string;
    created_at: string;
    comments: ForumComment[];
    [key: string]: any;

}

export const ForumService = {
    getAllTopics: async (
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: ForumTopic[]; meta?: any }> => {
        return fetchApi<{ data: ForumTopic[]; meta?: any }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/forums/`
        );
    },

    createTopic: async (data: Partial<ForumTopic>): Promise<ForumTopic> => {
        return fetchApi<ForumTopic>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/forums`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }
        );
    },

    getTopic: async (id: number): Promise<ForumTopic> => {
        return fetchApi<ForumTopic>(`${process.env.NEXT_PUBLIC_SERVER_URL}/forums/${id}`);
    },

    updateTopic: async (id: number, data: Partial<ForumTopic>): Promise<{ status: string, message: string, topic: ForumTopic }> => {
        return fetchApi(`${process.env.NEXT_PUBLIC_SERVER_URL}/forums/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    },

    deleteTopic: async (id: number): Promise<{ status: string, message: string }> => {
        return fetchApi(`${process.env.NEXT_PUBLIC_SERVER_URL}/forums/${id}`, {
            method: "DELETE"
        });
    },
};
