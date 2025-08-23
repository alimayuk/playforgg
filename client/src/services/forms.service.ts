import { fetchApi } from "@/app/lib/fetchApi";
import { ForumTopic } from "@/types";

export const ForumService = {
    getAllTopics: async (): Promise<{ data: ForumTopic[]; meta?: any }> => {
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
