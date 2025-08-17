'use client'
import { useTranslations } from 'next-intl';
import ImageSwiper from '@/components/ImageSwiper';
import { CalendarDays, MessagesSquare } from 'lucide-react';
import Title from '@/components/Title';
import BlogCard from '@/components/BlogCard';
import { useEffect, useState } from 'react';
import { Blog } from '@/customServices/blogs.service';
import { Game } from '@/customServices/client.service';
import { Category, FeaturedCategories } from '@/customServices/categories.service';
import Link from 'next/link';
import { EmptyLittle } from '@/components/EmptyLittle';
import { getLocale } from '@/utils/localeUtils';

interface Forums {
    id: number;
    title: string;
    slug: string;
}
interface HomePageData {
    blogs: Blog[];
    games: Game[];
    categories: Category[];
    featuredCategories: FeaturedCategories[];
    forums: Forums[];
    status: string;
}

interface Props {
    initialData: HomePageData;
}

const HomePage: React.FC<Props> = ({ initialData }) => {
    const [data, setData] = useState<HomePageData>(initialData);
    const t = useTranslations('HomePage');
    const [loading, setLoading] = useState(false); // Artık initialData ile başladığı için false
    const [error, setError] = useState<string | null>(null);
    const locale = getLocale();
    // Trend forumlar için mock data
    const trends = data.categories.map(category => ({
        id: category.id,
        title: `En iyi ${category.title} stratejileri`,
        slug: category.slug
    }));

    if (error) return <div>{error}</div>;
    if (!data) return <div>Veri bulunamadı</div>;

    return (
        <div className='max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8'>
            {/* Image Swiper */}
            <ImageSwiper />

            {/* Öne Çıkan Kategoriler */}
            <div className='space-y-6 mt-8 md:mt-12'>
                <Title title1={"Öne Çıkan"} title2={'Kategoriler'} />
                <div className="mt-6 md:mt-12 p-4 md:p-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {data.featuredCategories.map((featuredCategorie) => (
                        <Link
                            href={`${locale}/blogs?category=${featuredCategorie.slug}`}
                            key={featuredCategorie.id}
                            className="relative h-32 sm:h-40 flex items-center justify-center gap-4 rounded-lg p-4 shadow cursor-pointer overflow-hidden group"
                            style={{
                                backgroundImage: `url('${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${featuredCategorie.image}')`,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-60 group-hover:bg-opacity-70 transition"></div>
                            <div className="relative flex items-center gap-4 z-10">
                                <div className="text-2xl md:text-3xl">{featuredCategorie.icon}</div>
                                <div className="flex flex-col">
                                    <span className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">{featuredCategorie.title}</span>
                                    {/* <span className="text-sm sm:text-base md:text-lg text-orange-400">{featuredCategorie.subtitle}</span> */}
                                </div>
                            </div>
                        </Link>
                    ))}
                    {data.featuredCategories.length === 0 && (
                        <EmptyLittle
                            title="Öne çıkan bulunamadı"
                            description={
                                <>
                                    Bu kategoride henüz bir öne çıkan eklenmemiş. <br />
                                    Daha sonra tekrar kontrol etmeyi unutmayın!
                                </>
                            }
                        />
                    )}
                </div>
            </div>

            {/* Son Gönderiler */}
            <div className='space-y-6 mt-8 md:mt-12'>
                <Title title1={"Son"} title2={'gönderiler'} />
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-4 md:gap-6">
                    {/* Sol taraf - Bloglar */}
                    <div className="lg:col-span-5 space-y-4 md:space-y-6">
                        {data.blogs.map((blog) => (
                            <div className="w-full" key={blog.id}>
                                <div className="h-full flex flex-col sm:flex-row items-center sm:justify-start justify-center text-center sm:text-left p-4
              bg-[#111827] rounded-lg shadow-lg border border-[#1f2937]">
                                    <img
                                        alt="blog"
                                        src={`${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${blog.image}`}
                                        className="flex-shrink-0 rounded-lg w-full sm:w-48 h-48 object-cover object-center sm:mb-0 mb-4"
                                    />
                                    <div className="flex-grow sm:pl-4 md:pl-8">
                                        <h2 className="title-font font-medium text-lg text-white">{blog.title}</h2>
                                        <h3 className="text-gray-500 mb-3">{blog.user.username}</h3>
                                        <div className='flex items-center justify-between flex-wrap gap-2'>
                                            <span className="flex items-center gap-2 text-gray-500 text-sm">
                                                <CalendarDays /> {new Date(blog.created_at).toLocaleDateString()}
                                            </span>
                                            <span className="flex items-center gap-2 text-gray-500 text-sm">
                                                <MessagesSquare /> {blog.comment_count}
                                            </span>
                                        </div>
                                        <p className="my-3 md:my-4 line-clamp-3 text-sm md:text-base">
                                            {blog.excerpt}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {data.blogs.length === 0 && (
                            <EmptyLittle
                                title="Blog bulunamadı"
                                description={
                                    <>
                                        Bu kategoride henüz bir blog eklenmemiş. <br />
                                        Daha sonra tekrar kontrol etmeyi unutmayın!
                                    </>
                                }
                            />
                        )}
                    </div>

                    {/* Sağ taraf - Yan içerik */}
                    <div className="lg:col-span-2 space-y-3 md:space-y-4">
                        <div className="py-3 px-3 md:py-4 md:pl-4 bg-gray-800 rounded-lg shadow">
                            <div className="flex items-center gap-2 md:gap-2 mb-3 md:mb-4">
                                <h3 className="font-semibold text-lg md:text-xl text-orange-600 uppercase whitespace-nowrap">
                                    Son
                                </h3>
                                <h3 className="font-semibold text-lg md:text-xl text-white uppercase whitespace-nowrap">
                                    Forumlar
                                </h3>
                                <div className="flex-grow h-px bg-white opacity-50"></div>
                            </div>
                            <ul className="space-y-1 text-white list-disc pl-4 md:pl-5 text-xs md:text-sm">
                                {data.forums.map((trend) => (
                                    <li key={trend.id}>
                                        <Link href={`/kategori/${trend.slug}`} className="hover:text-orange-400 transition">
                                            {trend.title}
                                        </Link>
                                    </li>
                                ))}
                                {trends.length === 0 && (
                                    <EmptyLittle
                                        title="Forumlar bulunamadı"
                                        description={
                                            <>
                                                Hala bir forum oluşmadı.
                                            </>
                                        }
                                    />
                                )}
                            </ul>
                        </div>

                        <div className="p-3 md:p-4 bg-gradient-to-r from-orange-100 via-orange-200 to-orange-300 rounded-lg shadow relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-base md:text-lg font-bold text-gray-800 mb-1 md:mb-2">Yeni CS2 Aksesuarları!</h3>
                                <p className="text-xs md:text-sm text-gray-700 mb-2 md:mb-4">
                                    Oyununuz kadar tarzınız da güçlü olsun. %25 indirim fırsatını kaçırmayın!
                                </p>
                                <button className="bg-orange-500 text-white text-xs md:text-sm font-semibold px-3 py-1 md:px-4 md:py-2 rounded hover:bg-orange-600 transition">
                                    Hemen İncele
                                </button>
                            </div>
                            <div className="absolute top-0 right-0 w-full h-full opacity-20">
                                <img src="/images/b.jpg" alt="banner" className="w-full h-full object-cover object-center" />
                            </div>
                        </div>

                        <div className="py-3 px-3 md:py-4 md:pl-4 bg-gray-800 rounded-lg shadow">
                            <div className="flex items-center gap-2 md:gap-2 mb-3 md:mb-4">
                                <h3 className="font-semibold text-lg md:text-xl text-orange-600 uppercase whitespace-nowrap">
                                    İçerik
                                </h3>
                                <h3 className="font-semibold text-lg md:text-xl text-white uppercase whitespace-nowrap">
                                    Kategorileri
                                </h3>
                                <div className="flex-grow h-px bg-white opacity-50"></div>
                            </div>
                            <ul className="space-y-1 text-white list-disc pl-4 md:pl-5 text-xs md:text-sm">
                                {data.categories.map((category) => (
                                    <li key={category.id}>
                                        <Link href={`/kategori/${category.slug}`} className="hover:text-orange-400 transition">
                                            {category.title}
                                        </Link>
                                    </li>
                                ))}
                                {data.categories.length === 0 && (
                                    <EmptyLittle
                                        title="Kategoriler bulunamadı"
                                        description={
                                            <>
                                                Hala bir kategori oluşmadı.
                                            </>
                                        }
                                    />
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tüm Bloglar */}
            <div className='space-y-6 mt-8 md:mt-12'>
                <Title title1={"Tüm"} title2={'Bloglar'} />
                <div className="mt-6 md:mt-12 p-4 md:p-6 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                    {data.blogs.map((blog) => (
                        <BlogCard key={blog.id} post={{
                            id: blog.id,
                            title: blog.title,
                            image: blog.image,
                            author: blog.user.username,
                            date: new Date(blog.created_at).toLocaleDateString(),
                            slug: blog.slug
                        }} />
                    ))}

                    {data.blogs.length === 0 && (
                        <EmptyLittle
                            title="Blog bulunamadı"
                            description={
                                <>
                                    Bu kategoride henüz bir blog eklenmemiş. <br />
                                    Daha sonra tekrar kontrol etmeyi unutmayın!
                                </>
                            }
                        />
                    )}
                </div>
            </div>

            {/* Oyun İçerikleri */}
            <div className='space-y-6 mt-8 md:mt-12'>
                <Title title1={"Oyun"} title2={'İçerikleri'} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {data.games.map((game) => (
                        <a href={`/games/${game.slug}`} key={game.id} className="group">
                            <div className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg isolate bg-gray-900 h-80 w-full md:h-96 transition-transform duration-500 hover:scale-105">
                                <img
                                    src={`${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${game.image}`}
                                    alt={game.title}
                                    className="absolute inset-0 w-full h-full object-cover -z-10 transition-transform duration-500 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent -z-10 rounded-xl"></div>
                                <span className="absolute top-4 right-4 bg-orange-600 text-white text-xs md:text-sm font-semibold px-2 py-1 rounded-full z-10">
                                    {game.category.title}
                                </span>
                                <div className="absolute bottom-0 left-0 right-0 px-4 md:px-6 pb-4 md:pb-6 bg-gradient-to-t from-gray-900/90 to-transparent rounded-b-xl flex flex-col">
                                    <h3 className="text-white text-lg md:text-xl font-semibold leading-tight transition-transform duration-500 group-hover:-translate-y-2 line-clamp-2">
                                        {game.title}
                                    </h3>
                                    <div className="mt-1 md:mt-2 text-gray-300 text-xs md:text-sm opacity-0 max-h-0 overflow-hidden transition-all duration-500 group-hover:opacity-100 group-hover:max-h-20 line-clamp-3">
                                        {game.excerpt}
                                    </div>
                                </div>
                            </div>
                        </a>
                    ))}

                    {data.games.length === 0 && (
                        <EmptyLittle
                            title="Oyun bulunamadı"
                            description={
                                <>
                                    Bu kategoride henüz bir oyun eklenmemiş. <br />
                                    Daha sonra tekrar kontrol etmeyi unutmayın!
                                </>
                            }
                        />
                    )}
                </div>
            </div>

            {/* Topluluk İçeriği */}
            <div className="space-y-6 mt-8 md:mt-12">
                <Title title1={"Topluluk"} title2={'İçeriği'} />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div className="bg-[#111827] rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition border border-white/10">
                        <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">🎯 Forum Tartışmaları</h4>
                        <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-4">
                            Oyunlarla ilgili strateji paylaşın, turnuvaları değerlendirin, fikirlerinizi yazın.
                        </p>
                        <a href="/forum" className="text-orange-500 font-semibold text-xs md:text-sm hover:underline">
                            Foruma Git →
                        </a>
                    </div>

                    <div className="bg-[#111827] rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition border border-white/10">
                        <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">💬 Discord Sunucusu</h4>
                        <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-4">
                            Sohbet et, yeni oyuncularla tanış, etkinlikleri kaçırma. Aktif topluluk seni bekliyor.
                        </p>
                        <a href="https://discord.gg/yourserver" target="_blank" className="text-orange-500 font-semibold text-xs md:text-sm hover:underline">
                            Discord'a Katıl →
                        </a>
                    </div>

                    <div className="bg-[#111827] rounded-xl shadow-md p-4 md:p-6 hover:shadow-lg transition border border-white/10">
                        <h4 className="text-base md:text-lg font-bold text-white mb-1 md:mb-2">📸 Oyuncu Paylaşımları</h4>
                        <p className="text-xs md:text-sm text-gray-400 mb-2 md:mb-4">
                            Ekran görüntüleri, zafer anları, komik anlar... Gönder ve paylaş!
                        </p>
                        <a href="/paylasimlar" className="text-orange-500 font-semibold text-xs md:text-sm hover:underline">
                            Paylaşımları Gör →
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HomePage;