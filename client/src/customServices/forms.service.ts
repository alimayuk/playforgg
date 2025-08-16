import { fetchWithAuth } from "@/app/lib/fetchWithAuth";

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
    // Tüm forum konularını listele
    getAllTopics: async (
        page: number = 1,
        per_page: number = 5
    ): Promise<{ data: ForumTopic[]; meta?: any }> => {
        return fetchWithAuth<{ data: ForumTopic[]; meta?: any }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/forums/`
        );
    },

    // Yeni konu oluştur
    createTopic: async (data: Partial<ForumTopic>): Promise<ForumTopic> => {
        return fetchWithAuth<ForumTopic>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/forums`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            }
        );
    },

    // Tek bir konuyu getir
    getTopic: async (id: number): Promise<ForumTopic> => {
        return fetchWithAuth<ForumTopic>(`${process.env.NEXT_PUBLIC_SERVER_URL}/forums/${id}`);
    },

    // Konuyu güncelle
    updateTopic: async (id: number, data: Partial<ForumTopic>): Promise<{ status: string, message: string, topic: ForumTopic }> => {
        return fetchWithAuth(`${process.env.NEXT_PUBLIC_SERVER_URL}/forums/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    },

    // Konuyu sil
    deleteTopic: async (id: number): Promise<{ status: string, message: string }> => {
        return fetchWithAuth(`${process.env.NEXT_PUBLIC_SERVER_URL}/forums/${id}`, {
            method: "DELETE"
        });
    },

    // Yorum ekle
    addComment: async (topicId: number, data: Partial<ForumComment>): Promise<ForumComment> => {
        return fetchWithAuth<ForumComment>(`${process.env.NEXT_PUBLIC_SERVER_URL}/forums/${topicId}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    },

    // Yorum güncelle
    updateComment: async (id: number, data: Partial<ForumComment>): Promise<{ status: string, message: string, comment: ForumComment }> => {
        return fetchWithAuth(`${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
    },

    // Yorum sil
    deleteComment: async (id: number): Promise<{ status: string, message: string }> => {
        return fetchWithAuth(`${process.env.NEXT_PUBLIC_SERVER_URL}/comments/${id}`, {
            method: "DELETE"
        });
    },
};
