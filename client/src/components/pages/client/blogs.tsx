'use client';

import React, { useEffect, useState } from 'react';
import Title from '@/components/Title';
import Link from 'next/link';
import { Blog } from '@/customServices/client.service';
import { useSearchParams, useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import Empty from '@/components/Empty';
import Loading from '@/components/Loading';

interface Category {
    id: number;
    title: string;
    slug: string;
}

interface Props {
    initialData: {
        data: Blog[];
        categories: Category[];
        status: boolean;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}

const BlogPage: React.FC<Props> = ({ initialData }) => {
    const [blogs, setBlogs] = useState(initialData.data);
    const [categories, setCategories] = useState(initialData.categories);
    const [pagination, setPagination] = useState(initialData.meta);
    const [loading, setLoading] = useState(false);

    const searchParams = useSearchParams();
    const router = useRouter();
    const initialCategory = searchParams.get('category') || 'tum';
    const initialPage = parseInt(searchParams.get('page') || '1', 5);

    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [currentPage, setCurrentPage] = useState(initialPage);

    useEffect(() => {
        const fetchFiltered = async () => {
            setLoading(true); // yükleniyor başlasın
            const locale = Cookies.get("NEXT_LOCALE") || "tr";
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/client/blogs?locale=${locale}&category=${selectedCategory}&perPage=9&page=${currentPage}`,
                    {
                        headers: { Accept: 'application/json' },
                        cache: 'no-store',
                    }
                );
                const json = await res.json();
                setBlogs(json.data);
                setCategories(json.categories);
                setPagination(json.meta);
            } catch (error) {
                console.error('Bloglar alınamadı', error);
            } finally {
                setLoading(false); // yüklenme bitti
            }
        };

        fetchFiltered();
    }, [selectedCategory, currentPage]);
    
    useEffect(() => {
        const params = new URLSearchParams();
        if (selectedCategory !== 'tum') params.set('category', selectedCategory);
        if (currentPage !== 1) params.set('page', currentPage.toString());

        const query = params.toString();
        router.push(`?${query}`, { scroll: false });
    }, [selectedCategory, currentPage]);



    const changePage = (dir: 'prev' | 'next') => {
        setCurrentPage((prev) => {
            if (dir === 'prev') return Math.max(prev - 1, 1);
            if (dir === 'next') return Math.min(prev + 1, pagination.last_page);
            return prev;
        });
    };

    return (
        <div className="max-w-screen-2xl mx-auto px-4 py-12">
            <Title title1="Blog" title2="Yazıları" />

            {/* Kategori filtre */}
            <div className="mb-8">
                <select
                    value={selectedCategory}
                    onChange={(e) => {
                        setSelectedCategory(e.target.value);
                        setCurrentPage(1);
                    }}
                    className="bg-gray-800 text-white py-2 px-10 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                    <option value="tum">Tümü</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                            {cat.title}
                        </option>
                    ))}
                </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
                {loading ? (
                    <div className="col-span-full">
                        <Loading />
                    </div>
                ) : blogs.length > 0 ? (
                    blogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-[#1e293b] rounded-xl shadow-md hover:shadow-lg transition"
                        >
                            <img
                                src={
                                    blog.image
                                        ? `${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${blog.image}`
                                        : 'https://via.placeholder.com/800x450?text=No+Image'
                                }
                                alt={blog.title}
                                className="w-full h-48 object-cover rounded-t-xl"
                            />
                            <div className="p-4">
                                <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                                    <span className="font-medium">{blog.category?.title}</span>
                                    <span>{new Date(blog.created_at).toLocaleDateString('tr-TR')}</span>
                                </div>
                                <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{blog.title}</h3>
                                <p className="text-sm text-gray-300 mb-4 line-clamp-3">{blog.excerpt}</p>
                                <Link
                                    href={`/blogs/${blog.slug}`}
                                    className="text-orange-500 font-semibold hover:text-orange-400 hover:underline"
                                >
                                    Devamını Oku →
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full">
                        <Empty
                            title="Blog yazısı bulunamadı"
                            description="Seçtiğiniz kriterlere uygun blog yazısı bulunamadı."
                        />
                    </div>
                )}
            </div>


            {/* Sayfalama */}
            {pagination.last_page > 1 && (
                <div className="flex items-center justify-center gap-4">
                    <button
                        onClick={() => changePage('prev')}
                        disabled={currentPage === 1}
                        className="px-4 py-2 rounded bg-gray-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-600 transition"
                    >
                        ← Önceki
                    </button>
                    <span className="text-sm text-gray-300">
                        Sayfa {currentPage} / {pagination.last_page}
                    </span>
                    <button
                        onClick={() => changePage('next')}
                        disabled={currentPage === pagination.last_page}
                        className="px-4 py-2 rounded bg-gray-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-600 transition"
                    >
                        Sonraki →
                    </button>
                </div>
            )}
        </div>
    );
};

export default BlogPage;
