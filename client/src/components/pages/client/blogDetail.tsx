'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BlogDetailResponse, Comment } from '@/types';
import CommentsSection from '@/components/CommentsSection';

type Props = {
    initialData: BlogDetailResponse;
};

export default function BlogDetailPage({ initialData }: Props) {
    const { data: blog, otherBlogs } = initialData;

    const [comments, setComments] = useState<Comment[]>([]);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/client/blogs/${blog.id}/comments`
                );
                const data = await res.json();
                setComments(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchComments();
    }, [blog.id]);

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
                        <span>{blog.created_at}</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-white">{blog.title}</h1>
                    <div className='prose max-w-none text-white '>
                        <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                    </div>
                </div>

                {/* Comments */}
                <CommentsSection
                    type="blogs"
                    contentId={blog.id}
                    initialComments={comments}
                />
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
                                    <p className="text-sm text-gray-500">{b.created_at}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
