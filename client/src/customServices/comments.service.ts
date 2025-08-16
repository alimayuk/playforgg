import { fetchWithAuth } from "@/app/lib/fetchWithAuth";

export interface Comment {
    id: number;
    author_id: number;
    text: string;
    parent_id: number | null;
    replies?: Comment[];
    user: {
        id: number;
        username: string;
        email?: string;
    };
    [key: string]: any;
}

export const CommentsService = {
    addComment: (type: "blogs" | "forum-topics", id: number, text: string) =>
        fetchWithAuth<Comment>(`${process.env.NEXT_PUBLIC_SERVER_URL}/${type}/${id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        }),

    addReply: (type: "blogs" | "forum-topics", id: number, parentId: number, text: string) =>
        fetchWithAuth<Comment>(`${process.env.NEXT_PUBLIC_SERVER_URL}/${type}/${id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, parent_id: parentId })
        }),

    updateComment: (type: "blogs" | "forum-topics", id: number, commentId: number, text: string) =>
        fetchWithAuth<Comment>(`${process.env.NEXT_PUBLIC_SERVER_URL}/${type}/${id}/comments/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        }),

    deleteComment: (type: "blogs" | "forum-topics", id: number, commentId: number) =>
        fetchWithAuth<{ message: string }>(`${process.env.NEXT_PUBLIC_SERVER_URL}/${type}/${id}/comments/${commentId}`, {
            method: "DELETE"
        })
};
