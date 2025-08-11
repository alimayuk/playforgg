import { fetchWithAuth } from "@/app/lib/fetchWithAuth";

export interface Comment {
    id: number;
    author_id: number;
    text: string;
    parent_id: number;
    replies?: Comment[];
    [key: string]: any;
}

export const CommentsService = {
    addComment: (blogId: number, text: string) => {
        return fetchWithAuth<Comment>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${blogId}/comments`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            }
        );
    },

    addReply: (blogId: number, parentId: number, text: string) => {
        return fetchWithAuth<Comment>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${blogId}/comments`,
            {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text, parent_id: parentId })
            }
        );
    },

    updateComment: (blogId: number, commentId: number, text: string) => {
        return fetchWithAuth<Comment>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${blogId}/comments/${commentId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            }
        );
    },

    updateReply: (blogId: number, replyId: number, text: string) => {
        return fetchWithAuth<Comment>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${blogId}/comments/${replyId}`,
            {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ text })
            }
        );
    },

    deleteComment: (blogId: number, commentId: number) => {
        return fetchWithAuth<{ message: string }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${blogId}/comments/${commentId}`,
            { method: "DELETE" }
        );
    },

    deleteReply: (blogId: number, replyId: number) => {
        return fetchWithAuth<{ message: string }>(
            `${process.env.NEXT_PUBLIC_SERVER_URL}/blogs/${blogId}/comments/${replyId}`,
            { method: "DELETE" }
        );
    }
};
