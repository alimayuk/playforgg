import { fetchApi } from "@/app/lib/fetchApi";
import { CommentType } from "@/types";

export const CommentsService = {
    addComment: (type: "blogs" | "forum-topics", id: number, text: string) =>
        fetchApi<CommentType>(`${process.env.NEXT_PUBLIC_SERVER_URL}/${type}/${id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        }),

    addReply: (type: "blogs" | "forum-topics", id: number, parentId: number, text: string) =>
        fetchApi<CommentType>(`${process.env.NEXT_PUBLIC_SERVER_URL}/${type}/${id}/comments`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text, parent_id: parentId })
        }),

    updateComment: (type: "blogs" | "forum-topics", id: number, commentId: number, text: string) =>
        fetchApi<CommentType>(`${process.env.NEXT_PUBLIC_SERVER_URL}/${type}/${id}/comments/${commentId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        }),

    deleteComment: (type: "blogs" | "forum-topics", id: number, commentId: number) =>
        fetchApi<{ message: string }>(`${process.env.NEXT_PUBLIC_SERVER_URL}/${type}/${id}/comments/${commentId}`, {
            method: "DELETE"
        })
};
