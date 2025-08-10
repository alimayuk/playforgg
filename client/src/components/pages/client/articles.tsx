'use client';
import React, { useEffect, useState, useCallback } from 'react';
import Title from '@/components/Title';
import { Article } from '@/customServices/articles.service';
import Cookies from 'js-cookie';


interface Props {
    initialData: {
        data: Article[];
        status: boolean;
        meta: {
            current_page: number;
            last_page: number;
            per_page: number;
            total: number;
        };
    };
}


const ArticlesPage: React.FC<Props> = ({ initialData }) => {

    const [articles, setArticles] = useState<Article[]>(initialData.data || []);
    const [page, setPage] = useState(initialData.meta.current_page);
    const [lastPage, setLastPage] = useState(initialData.meta.last_page);
    const [loading, setLoading] = useState(false);

    const loadMore = useCallback(async () => {
        if (loading || page >= lastPage) return;
        setLoading(true);
        const locale = Cookies.get("NEXT_LOCALE") || "tr";
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/client/articles?locale=${locale}&perPage=6&page=${page + 1}`
            );
            const json = await res.json();
            setArticles((prev) => [...prev, ...json.data]);
            setPage(json.meta.current_page);
            setLastPage(json.meta.last_page);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [page, lastPage, loading]);

    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + window.scrollY >=
                document.body.offsetHeight - 200
            ) {
                loadMore();
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loadMore]);

    return (
        <div className="max-w-screen-2xl mx-auto px-4 py-12 relative">
            <Title title1="Espor" title2="Haberleri" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
                {articles.map((news) => (
                    <div
                        key={news.slug}
                        className=" bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                    >
                        <div className="relative w-full group">
                            <img
                                src={`${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${news.image}`}
                                alt={news.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{news.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{news.excerpt}</p>
                            <span className="text-xs text-gray-400 mt-2 block">
                                {new Date(news.created_at).toLocaleDateString('tr-TR')}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {loading && (
                <div className="text-center mt-6 text-gray-500">Yükleniyor...</div>
            )}
        </div>
    );
};

export default ArticlesPage;
