'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCookie } from 'cookies-next';
import { useUserStore } from '@/stores/userStore';
import { CommentsService } from '@/customServices/comments.service';

type ReplyType = {
    id: number;
    user: { id: number; username: string };
    text: string;
    created_at: string;
};

type CommentType = {
    id: number;
    user: { id: number; username: string };
    text: string;
    created_at: string;
    replies: ReplyType[];
};

type BlogType = {
    id: number;
    title: string;
    content: string;
    image: string;
    category: {
        title: string;
        slug: string;
    };
    date: string;
};

type OtherBlogType = {
    id: number;
    title: string;
    slug: string;
    image: string;
    date: string;
    category: {
        title: string;
        slug: string;
    };
};

type Props = {
    initialData: {
        data: BlogType;
        otherBlogs: OtherBlogType[];
    };
};

function timeAgo(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((+now - +date) / 1000);
    if (diff < 60) return `${diff} saniye önce`;
    if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
}

export default function BlogDetailPage({ initialData }: Props) {
    const { data: blog, otherBlogs } = initialData;

    const [comments, setComments] = useState<CommentType[]>([]);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [activeReply, setActiveReply] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const user = useUserStore((s) => s.user);
    const [editingComment, setEditingComment] = useState<number | null>(null);
    const [editText, setEditText] = useState("");
    const [editingReply, setEditingReply] = useState<number | null>(null);
    const [editReplyText, setEditReplyText] = useState("");
    
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/client/blogs/${blog.id}/comments`
                );
                if (!res.ok) throw new Error('Yorumlar yüklenemedi');
                const data = await res.json();
                setComments(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [blog.id]);

    const handleAddComment = async () => {
        if (!commentText.trim()) return;
        setLoading(true);
        try {
            const newComment: any = await CommentsService.addComment(blog.id, commentText);
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
            const newReply: any = await CommentsService.addReply(blog.id, commentId, replyText);
            setComments(prev =>
                prev.map(c =>
                    c.id === commentId
                        ? { ...c, replies: [...c.replies, newReply] }
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

    const handleUpdateComment = async (commentId: number) => {
        if (!editText.trim()) return;
        try {
            const updated = await CommentsService.updateComment(blog.id, commentId, editText);
            setComments(prev =>
                prev.map(c => (c.id === commentId ? { ...c, text: updated.text } : c))
            );
            setEditingComment(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleUpdateReply = async (replyId: number) => {
        if (!editReplyText.trim()) return;
        try {
            const updated = await CommentsService.updateReply(blog.id, replyId, editReplyText);
            setComments(prev =>
                prev.map(c => ({
                    ...c,
                    replies: c.replies.map(r =>
                        r.id === replyId ? { ...r, text: updated.text } : r
                    )
                }))
            );
            setEditingReply(null);
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        if (!confirm("Bu yorumu silmek istediğinize emin misiniz?")) return;
        try {
            await CommentsService.deleteComment(blog.id, commentId);
            setComments(prev => prev.filter(c => c.id !== commentId));
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteReply = async (replyId: number) => {
        if (!confirm("Bu yanıtı silmek istediğinizden emin misiniz?")) return;
        try {
            await CommentsService.deleteReply(blog.id, replyId);
            setComments(prev =>
                prev.map(c => ({
                    ...c,
                    replies: c.replies.filter(r => r.id !== replyId)
                }))
            );
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="max-w-screen-2xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8 text-gray-200">
                {/* Blog Content */}
                <div>
                    <img
                        src={
                            blog.image
                                ? `${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${blog.image}`
                                : 'https://via.placeholder.com/800x450?text=No+Image'
                        }
                        alt={blog.title}
                        className="w-full h-72 object-cover object-top rounded-xl mb-6"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>{blog.category.title}</span>
                        <span>{blog.date}</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-white">{blog.title}</h1>
                    <div className='prose max-w-none text-white '>
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>
                </div>

                {/* Comments */}
                <div>
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
                            Yorum yapabilmek için giriş yapmalısınız.
                        </p>
                    )}

                    {/* Comment list */}
                    <div className="space-y-6">
                        {comments.map((comment) => (
                            <div key={comment.id} className="bg-[#1e293b] rounded-lg p-4">
                                <div className="flex justify-between">
                                    <p className="font-semibold text-sm text-orange-400">{comment.user.username}</p>

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
                                                onClick={() => handleDeleteComment(comment.id)}
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
                                                onClick={() => handleUpdateComment(comment.id)}
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
                                {comment.replies.map((reply) => (
                                    <div key={reply.id} className="border-l-2 border-orange-700 pl-4">
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
                                                        onClick={() => handleUpdateReply(reply.id)}
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
                                                    onClick={() => handleDeleteReply(reply.id)}
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
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#1e293b] rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Diğer Yazılar</h3>
                    <ul className="space-y-4">
                        {otherBlogs.map((b) => (
                            <li key={b.id} className="flex gap-3 items-start">
                                <img
                                    src={
                                        b.image
                                            ? `${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${b.image}`
                                            : 'https://via.placeholder.com/800x450?text=No+Image'
                                    }
                                    alt={b.title}
                                    className="w-20 h-20 object-cover rounded-md shrink-0"
                                />
                                <div className="flex-1">
                                    <Link href={`/blogs/${b.slug}`}>
                                        <p className="font-medium text-gray-300 hover:text-orange-500 text-md line-clamp-2 mb-1">
                                            {b.title}
                                        </p>
                                    </Link>
                                    <p className="text-sm text-gray-500">{b.date}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
