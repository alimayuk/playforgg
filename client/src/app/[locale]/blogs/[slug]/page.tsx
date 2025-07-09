'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const blog = {
    id: 1,
    title: 'CS2 Takım Taktikleri',
    content: `CS2’de takım oyunu kazanmanın sırları... Harita kontrolü, ekonomi yönetimi, utility kullanımı ve daha fazlası bu rehberde!`,
    image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/9a2ab1e173fffb0d02cbbbd2d31e1285ee226c13-1920x1080.png?auto=format&fit=max&w=1920',
    category: 'Rehber',
    date: '07.07.2025',
};

const otherBlogs = [
    {
        id: 2,
        title: 'Valorant Yeni Ajan Analizi Başlığı Çok Uzun Olabilir ve Bu Kadar Uzun Olmamalı',
        date: '06.07.2025',
        image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/9a2ab1e173fffb0d02cbbbd2d31e1285ee226c13-1920x1080.png?auto=format&fit=max&w=1920',
        slug: 'valorant-yeni-ajan',
    },
    {
        id: 3,
        title: 'LoL Makro Strateji',
        date: '05.07.2025',
        image: 'https://cmsassets.rgpub.io/sanity/images/dsfx7636/news_live/9a2ab1e173fffb0d02cbbbd2d31e1285ee226c13-1920x1080.png?auto=format&fit=max&w=1920',
        slug: 'lol-makro-strateji',
    },
];

type ReplyType = {
    id: number;
    name: string;
    text: string;
    createdAt: Date;
};

type CommentType = {
    id: number;
    name: string;
    text: string;
    createdAt: Date;
    replies: ReplyType[];
};

function timeAgo(date: Date): string {
    const now = new Date();
    const diff = Math.floor((+now - +date) / 1000);
    if (diff < 60) return `${diff} saniye önce`;
    if (diff < 3600) return `${Math.floor(diff / 60)} dakika önce`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
    return `${Math.floor(diff / 86400)} gün önce`;
}

export default function BlogDetailPage() {
    const [comments, setComments] = useState<CommentType[]>([]);
    const [commentText, setCommentText] = useState('');
    const [replyText, setReplyText] = useState('');
    const [activeReply, setActiveReply] = useState<number | null>(null);
    const isLoggedIn = true; // Simulate user login state
    const handleAddComment = () => {
        if (commentText.trim()) {
            const newComment: CommentType = {
                id: Date.now(),
                name: 'Ziyaretçi',
                text: commentText,
                createdAt: new Date(),
                replies: [],
            };
            setComments([newComment, ...comments]);
            setCommentText('');
        }
    };

    const handleAddReply = (commentId: number) => {
        if (replyText.trim()) {
            const newReply: ReplyType = {
                id: Date.now(),
                name: 'Ziyaretçi',
                text: replyText,
                createdAt: new Date(),
            };
            setComments((prev) =>
                prev.map((c) =>
                    c.id === commentId ? { ...c, replies: [...c.replies, newReply] } : c
                )
            );
            setReplyText('');
            setActiveReply(null);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8 text-gray-200">
                <div>
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-72 object-cover rounded-xl mb-6"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>{blog.category}</span>
                        <span>{blog.date}</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-white">{blog.title}</h1>
                    <p className="leading-relaxed whitespace-pre-line">{blog.content}</p>
                </div>

                {/* Comments */}
                <div>
                    <h2 className="text-2xl font-bold mb-4 text-orange-500">Yorumlar</h2>

                    {isLoggedIn ? (
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
                                    className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
                                >
                                    Gönder
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm italic text-gray-400">
                            Yorum yapabilmek için giriş yapmalısınız.
                        </p>
                    )}

                    <div className="space-y-6">
                        {/* Yorum listesi */}
                        {comments.map((comment) => (
                            <div key={comment.id} className="bg-[#1e293b] rounded-lg p-4">
                                <div>
                                    <p className="font-semibold text-sm text-orange-400">{comment.name}</p>
                                    <p className="text-gray-300 text-sm whitespace-pre-line break-words">{comment.text}</p>
                                    <div className="text-xs text-gray-500 mt-1">{timeAgo(comment.createdAt)}</div>

                                    {/* Yanıtla butonu */}
                                    {isLoggedIn && (
                                        <button
                                            className="text-sm text-orange-500 mt-2 hover:underline"
                                            onClick={() => setActiveReply(comment.id)}
                                        >
                                            Yanıtla
                                        </button>
                                    )}

                                    {/* Yanıtlar */}
                                    {comment.replies.length > 0 && (
                                        <div className="mt-4 space-y-3 pl-4 border-l-2 border-orange-700">
                                            {comment.replies.map((reply) => (
                                                <div key={reply.id}>
                                                    <p className="font-semibold text-sm text-orange-500">{reply.name}</p>
                                                    <p className="text-gray-300 text-sm whitespace-pre-line break-words">{reply.text}</p>
                                                    <div className="text-xs text-gray-500 mt-1">{timeAgo(reply.createdAt)}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {/* Yanıt kutusu */}
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
                                                        className="text-sm px-3 py-1 bg-orange-600 text-white rounded hover:bg-orange-700 transition"
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
                                    src={b.image}
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
