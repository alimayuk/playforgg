'use client';
import Title from '@/components/Title';
import { Game } from '@/customServices/games.service';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import Loading from '@/components/Loading';
import Empty from '@/components/Empty';

interface Category {
    id: number;
    title: string;
    slug: string;
}

interface Props {
    initialData: {
        data: Game[];
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

const GamePage: React.FC<Props> = ({ initialData }) => {
    const [games, setGames] = useState(initialData.data);
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
                    `${process.env.NEXT_PUBLIC_SERVER_URL}/client/games?locale=${locale}&category=${selectedCategory}&perPage=9&page=${currentPage}`,
                    {
                        headers: { Accept: 'application/json' },
                        cache: 'no-store',
                    }
                );
                const json = await res.json();
                setGames(json.data);
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
        <section className=" max-w-screen-2xl mx-auto px-4 py-10">
            <div className="mb-8">
                <Title title1="Tüm" title2="Oyunlar" />
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
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6">
                {loading ? (
                    <div className="col-span-full">
                        <Loading />
                    </div>
                ) : games.length > 0 ? (
                    games.map((game) => (
                        <a href={`/games/${game.slug}`} key={game.id} className="group">
                            <div
                                className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg isolate bg-gray-900 h-96 w-72 transition-transform duration-500 hover:scale-105"
                            >
                                {/* Arka plan resmi */}
                                <img
                                    src={
                                        game.image
                                            ? `${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${game.image}`
                                            : 'https://via.placeholder.com/800x450?text=No+Image'
                                    }
                                    alt={game.title}
                                    className="absolute inset-0 w-full h-full object-cover -z-10 transition-transform duration-500 group-hover:scale-105"
                                />

                                {/* Karartma overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent -z-10 rounded-xl"></div>

                                {/* Kategori etiketi */}
                                <span className="absolute top-5 right-5 bg-orange-600 text-white text-sm font-semibold px-3 py-1 rounded-full z-10">
                                    {game.category.title}
                                </span>

                                {/* Alt içerik container */}
                                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 bg-gradient-to-t from-gray-900/90 to-transparent rounded-b-xl flex flex-col">
                                    {/* Başlık */}
                                    <div className="text-white text-xl font-semibold leading-tight transition-transform duration-500 group-hover:-translate-y-2 space-y-1">
                                        <h3 className='line-clamp-3'>{game.title}</h3>
                                        <p className="text-gray-400 text-sm">{game.user.username}</p>
                                    </div>

                                    {/* Açıklama */}
                                    <div
                                        className="mt-2 text-gray-300 text-sm opacity-0 max-h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:max-h-28 line-clamp-4"
                                        style={{ transitionTimingFunction: "cubic-bezier(0.4, 0, 0.2, 1)" }}
                                    >
                                        {game.description}
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))
                ) : (
                    <div className="col-span-full">
                        <Empty
                            title="Oyun yazısı bulunamadı"
                            description="Seçtiğiniz kriterlere uygun oyun yazısı bulunamadı."
                        />
                    </div>
                )}
            </div>
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
        </section>
    );
}
export default GamePage;
