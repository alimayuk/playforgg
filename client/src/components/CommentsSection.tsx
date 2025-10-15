'use client';
import { useState, useEffect } from 'react';
import { CommentsService } from '@/services/comments.service';
import Link from 'next/link';
import { useUserStore } from '@/stores/userStore';
import { timeAgo } from '@/utils/time';
import { Comment } from '@/types';

interface CommentsSectionProps {
    type: 'blogs' | 'forum-topics';
    contentId: number;
    initialComments?: Comment[];
}

export default function CommentsSection({ type, contentId, initialComments }: CommentsSectionProps) {
    const [comments, setComments] = useState<Comment[]>(initialComments || []);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [activeReply, setActiveReply] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const user = useUserStore((s) => s.user);
    const [editingComment, setEditingComment] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [editingReply, setEditingReply] = useState<number | null>(null);
    const [editReplyText, setEditReplyText] = useState("");

    useEffect(() => {
        const fetchComments = async () => {
            try {
                setCommentsLoading(true);
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/client/${type}/${contentId}/comments`
                );
                const data = await res.json();
                setComments(data);
            } catch (err) {
                console.error('Yorumlar yüklenirken hata:', err);
            } finally {
                setCommentsLoading(false);
            }
        };

        if (contentId) {
            fetchComments();
        }
    }, [type, contentId]);

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setLoading(true);
        try {
            const newComment = await CommentsService.addComment(type, contentId, commentText);
            setComments(prev => [newComment, ...prev]);
            setCommentText('');
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddReply = async (commentId: number) => {
        if (!replyText.trim()) return;
        setLoading(true);
        try {
            const newReply = await CommentsService.addReply(type, contentId, commentId, replyText);
            setComments(prev =>
                prev.map(c =>
                    c.id === commentId
                        ? { ...c, replies: [...(c.replies || []), newReply] }
                        : c
                )
            );
            setReplyText('');
            setActiveReply(null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateCommentOrReply = async (commentId: number, parentId: number | null, text: string) => {
        if (!text.trim()) return;
        try {
            const updated = await CommentsService.updateComment(type, contentId, commentId, text);
            if (parentId === null) {
                setComments(prev =>
                    prev.map(c => (c.id === commentId ? { ...c, text: updated.text } : c))
                );
                setEditingComment(null);
            } else {
                setComments(prev =>
                    prev.map(c =>
                        c.id === parentId
                            ? {
                                ...c,
                                replies: c.replies?.map(r => r.id === commentId ? { ...r, text: updated.text } : r) || []
                            }
                            : c
                    )
                );
                setEditingReply(null);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCommentOrReply = async (commentId: number, parentId: number | null) => {
        if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
        try {
            await CommentsService.deleteComment(type, contentId, commentId);
            if (parentId === null) {
                // Comment silme
                setComments(prev => prev.filter(c => c.id !== commentId));
            } else {
                // Reply silme
                setComments(prev =>
                    prev.map(c =>
                        c.id === parentId
                            ? { ...c, replies: c.replies?.filter(r => r.id !== commentId) || [] }
                            : c
                    )
                );
            }
        } catch (err) {
            console.error(err);
        }
    };
    if (commentsLoading) {
        return <div className="text-center py-4 text-gray-400">Yorumlar yükleniyor...</div>;
    }
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-4 text-orange-500">Yorumlar</h2>

            {user ? (
                <div className="mb-6">
                    <textarea
                        placeholder="Yorumunuzu yazın (max 400 karakter)..."
                        className="w-full border border-gray-600 bg-[#1e293b] rounded-lg p-3 text-sm text-gray-200 resize-none max-h-40"
                        maxLength={400}
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-between items-center mt-2 text-gray-400">
                        <span className="text-sm">{400 - commentText.length} karakter kaldı</span>
                        <button
                            onClick={handleAddComment}
                            disabled={loading}
                            className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition disabled:opacity-50"
                        >
                            Gönder
                        </button>
                    </div>
                </div>
            ) : (
                <p className="text-sm italic text-gray-400 mb-5">
                    Yorum yapabilmek için <Link href="/auth/login" className="text-orange-500 hover:underline">giriş yapmalısınız</Link>.
                </p>
            )}

            {/* Comment list */}
            <div className="space-y-6">
                {comments.length === 0 ? (
                    <p className="text-center text-gray-400 py-8">Henüz yorum yapılmamış.</p>
                ) : (comments.map((comment) => (
                    <div key={comment.id} className="bg-[#1e293b] rounded-lg p-4">
                        <div className="flex justify-between">
                            <Link href={`/profile/${comment.user.username}`} className="font-semibold text-sm text-orange-400">{comment.user.username}</Link>

                            {/* Eğer giriş yapmış kullanıcı kendi yorumunu görüyorsa */}
                            {user && user.id === comment.user.id && (
                                <div className="flex gap-2 text-xs text-gray-400">
                                    <button
                                        onClick={() => {
                                            setActiveReply(null);
                                            setReplyText("");
                                            setEditingComment(comment.id);
                                            setEditText(comment.text);
                                        }}
                                        className="hover:text-orange-500"
                                    >
                                        Düzenle
                                    </button>
                                    <button
                                        onClick={() => handleDeleteCommentOrReply(comment.id, null)}
                                        className="hover:text-red-500"
                                    >
                                        Sil
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Düzenleme modu */}
                        {editingComment === comment.id ? (
                            <div className="mt-2">
                                <textarea
                                    className="w-full border border-gray-600 bg-[#1e293b] rounded-lg p-2 text-sm text-gray-200 resize-none"
                                    rows={2}
                                    maxLength={400}
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                />
                                <div className="flex justify-end gap-2 mt-1">
                                    <button
                                        onClick={() => handleUpdateCommentOrReply(comment.id, null, editText)}
                                        className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                                    >
                                        Kaydet
                                    </button>
                                    <button
                                        onClick={() => setEditingComment(null)}
                                        className="px-3 py-1 text-sm text-gray-400 hover:underline"
                                    >
                                        Vazgeç
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-300 text-sm whitespace-pre-line break-words">{comment.text}</p>
                                <div className="text-xs text-gray-500 mt-1">{timeAgo(comment.created_at)}</div>
                            </>
                        )}

                        {user && (
                            <button
                                className="text-sm text-orange-500 mt-2 hover:underline"
                                onClick={() => setActiveReply(comment.id)}
                            >
                                Yanıtla
                            </button>
                        )}

                        {/* Replies */}
                        {comment.replies?.map((reply) => (
                            <div key={reply.id} className="border-l-2 border-orange-700 pl-4 mt-3">
                                <p className="font-semibold text-sm text-orange-500">{reply.user.username}</p>

                                {editingReply === reply.id ? (
                                    <>
                                        <textarea
                                            className="w-full border border-gray-600 bg-[#1e293b] rounded-lg p-2 text-sm text-gray-200 resize-none"
                                            rows={2}
                                            maxLength={400}
                                            value={editReplyText}
                                            onChange={(e) => setEditReplyText(e.target.value)}
                                        />
                                        <div className="flex gap-2 mt-1">
                                            <button
                                                onClick={() => handleUpdateCommentOrReply(reply.id, comment.id, editReplyText)}
                                                className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700"
                                            >
                                                Kaydet
                                            </button>
                                            <button
                                                onClick={() => setEditingReply(null)}
                                                className="px-3 py-1 text-sm text-gray-400 hover:underline"
                                            >
                                                Vazgeç
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <p className="text-gray-300 text-sm whitespace-pre-line break-words">{reply.text}</p>
                                        <div className="text-xs text-gray-500 mt-1">{timeAgo(reply.created_at)}</div>
                                    </>
                                )}

                                {reply.user.id === user?.id && editingReply !== reply.id && (
                                    <div className="flex gap-3 mt-1">
                                        <button
                                            onClick={() => {
                                                setEditingReply(reply.id);
                                                setEditReplyText(reply.text);
                                            }}
                                            className="text-xs text-blue-400 hover:underline"
                                        >
                                            Düzenle
                                        </button>
                                        <button
                                            onClick={() => handleDeleteCommentOrReply(reply.id, comment.id)}
                                            className="text-xs text-red-400 hover:underline"
                                        >
                                            Sil
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* Reply box */}
                        {activeReply === comment.id && (
                            <div className="mt-2">
                                <textarea
                                    placeholder="Yanıtınızı yazın (max 400 karakter)..."
                                    className="w-full border border-gray-600 bg-[#1e293b] rounded-lg p-2 text-sm text-gray-200 resize-none max-h-36"
                                    rows={2}
                                    maxLength={400}
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                />
                                <div className="flex justify-between items-center mt-1 text-gray-400">
                                    <span className="text-xs">{400 - replyText.length} karakter kaldı</span>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleAddReply(comment.id)}
                                            disabled={loading}
                                            className="text-sm px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition disabled:opacity-50"
                                        >
                                            Gönder
                                        </button>
                                        <button
                                            onClick={() => {
                                                setActiveReply(null);
                                                setReplyText('');
                                            }}
                                            className="text-sm text-gray-400 hover:underline"
                                        >
                                            Vazgeç
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                ))
                )}
            </div>
        </div>
    );
}