'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';


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
        otherGames: OtherBlogType[];
    };
};

export default function GameDetailPage({ initialData }: Props) {
    const { data: blog, otherGames } = initialData;
    const [loading, setLoading] = useState(true);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [comments, setComments] = useState<CommentType[]>([]);

    useEffect(() => {
        // Simüle edilmiş yükleme süresi (gerçek uygulamada kaldırın)
        const timer = setTimeout(() => setLoading(false), 1000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const fetchComments = async () => {
            setCommentsLoading(true);
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/client/blogs/${blog.id}/comments`
                );
                if (!res.ok) throw new Error('Yorumlar yüklenemedi');
                const data = await res.json();
                setComments(data);
            } catch (err) {
                console.error(err);
            } finally {
                setCommentsLoading(false);
            }
        };
        fetchComments();
    }, [blog.id]);

    if (loading) {
        return (
            <div className="max-w-screen-2xl mx-auto px-4 py-12">
                <Loading />
            </div>
        );
    }

    if (!blog) {
        return (
            <div className="max-w-screen-2xl mx-auto px-4 py-12">
                <Empty
                    title="Blog bulunamadı"
                    description="Aradığınız blog yazısı mevcut değil veya silinmiş olabilir."
                    actionText="Bloglara Geri Dön"
                    actionHref="/blogs"
                />
            </div>
        );
    }

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
                    <div className='prose max-w-none text-white'>
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>
                </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-[#1e293b] rounded-lg shadow p-4">
                    <h3 className="text-lg font-semibold text-white mb-4">Diğer Yazılar</h3>
                    {otherGames.length > 0 ? (
                        <ul className="space-y-4">
                            {otherGames.map((b) => (
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
                                        <Link href={`/games/${b.slug}`}>
                                            <p className="font-medium text-gray-300 hover:text-orange-500 text-md line-clamp-2 mb-1">
                                                {b.title}
                                            </p>
                                        </Link>
                                        <p className="text-sm text-gray-500">{b.date}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <Empty
                            title="Başka yazı bulunamadı"
                            description="Bu kategoride başka yazı mevcut değil"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}