'use client';
import React, { useEffect, useState } from 'react';
import Title from '@/components/Title';
import { useRouter, useSearchParams } from 'next/navigation';

const newsList = [
    {
        slug: 'league-of-legends-worlds-2025',
        title: 'League of Legends Dünya Şampiyonası 2025',
        author: 'Ahmet Y.',
        image: '/images/insta3.jpg',
        summary: 'PlayForGG ve Team Hydra arasında kıyasıya bir mücadele bekleniyor.',
        date: '2025-07-04',
        content:
            'Bugün oynanacak olan League of Legends Dünya Şampiyonası 2025 tüm dünyadan izlenecek. Takımların formu ve son analizleri bu maçın kaderini belirleyecek. stay tuned! devamını okuyunuz. Bu maç, League of Legends sahnesinde önemli bir dönüm noktası olabilir. Takımların son formu ve stratejileri merakla bekleniyor.',
    },
    {
        slug: 'valorant-patch',
        title: 'Valorant Yeni Güncellemesi Yayında!',
        author: 'Mehmet K.',
        image: '/images/i.webp',
        summary: 'Yeni ajan ve harita değişiklikleri oyunu değiştirebilir.',
        date: '2025-07-03',
        content:
            'Valorant\'a gelen yeni güncelleme ile birlikte ajan dengeleri yeniden şekilleniyor. Özellikle Cypher severler dikkat! Yeni güncelleme ile Cypher\'ın yeteneklerinde önemli değişiklikler yapıldı. Bu değişiklikler, oyuncuların oyun içindeki stratejilerini köklü bir şekilde etkileyebilir.',
    },
    {
        slug: 'harita-degisiklikleri',
        title: 'CS2 Harita Değişiklikleri',
        author: 'Ahmet Y.',
        image: '/images/xx.png',
        summary: 'Takımlarda büyük değişiklikler yapıldı, yeni sezon öncesi dengeler değişiyor.',
        date: '2025-07-05',
        content:
            'CS2 takımlarının son harita değişiklikleri açıklandı. Oyuncular arasındaki uyum ve yeni stratejiler maçların seyrini etkileyecek.',
    },
    {
        slug: 'valorant-turnuva-basliyor',
        title: 'Valorant Turnuvası Bu Hafta Başlıyor!',
        author: 'Mehmet K.',
        image: '/images/insta2.webp',
        summary: 'Büyük ödüllerin olduğu turnuva rekabeti artıracak.',
        date: '2025-07-06',
        content:
            'Valorant hayranları için heyecan verici turnuva başlıyor. En iyi takımlar kıyasıya mücadele edecek ve ödüller sahiplerini bulacak.',
    },
    {
        slug: 'cs2-yeni-guncelleme',
        title: 'CS2 Yeni Güncelleme Detayları',
        author: 'Ahmet Y.',
        image: '/images/insta1.webp',
        summary: 'Harita ve silah dengeleri güncellendi, oyuncular yeniliklere adapte olmaya çalışıyor.',
        date: '2025-07-07',
        content:
            'CS2\'ye gelen yeni güncelleme ile haritalarda değişiklikler yapıldı ve silah dengeleri yeniden ayarlandı. Oyuncular bu yeniliklere hızlıca adapte olmaya çalışıyor.',
    },
    {
        slug: 'valorant-strateji-rehberi',
        title: 'Valorant İçin Strateji Rehberi',
        author: 'Mehmet K.',
        image: '/images/insta2.webp',
        summary: 'Yeni başlayanlar ve deneyimli oyuncular için taktikler.',
        date: '2025-07-08',
        content:
            'Valorant\'ta başarılı olmak için bilmeniz gereken temel stratejiler ve ipuçları bu rehberde toplandı. Hem yeni başlayanlar hem de deneyimli oyuncular için faydalı bilgiler var.',
    },
    {
        slug: 'esports-etkinlikleri-2025',
        title: '2025 Espor Etkinlik Takvimi',
        author: 'Ahmet Y.',
        image: '/images/i.webp',
        summary: 'Bu yıl gerçekleşecek önemli espor etkinlikleri ve tarihleri.',
        date: '2025-07-09',
        content:
            '2025 yılı espor dünyasında önemli etkinliklere sahne olacak. Tarihleri ve detayları bu yazıda bulabilirsiniz.',
    },
];
const fakeComments = [
    { author: 'Fatma G.', text: 'Oyun içi değişiklikler hakkında daha fazla bilgi istiyorum.' },
];


function ToggleableContent({ content }: { content: string }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const isLong = content.length > 180;

    return (
        <div>
            <p className="text-gray-700 dark:text-gray-200 text-sm leading-relaxed">
                {isExpanded || !isLong ? content : `${content.slice(0, 180)}...`}
            </p>
            {isLong && (
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-xs text-blue-600 dark:text-blue-400 mt-1"
                >
                    {isExpanded ? 'Daha az göster' : 'Devamını oku'}
                </button>
            )}
        </div>
    );
}
export default function NewsPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const slug = searchParams.get('haber');
    const selectedNews = newsList.find((n) => n.slug === slug);

    // Modal dışına tıklayınca kapatma
    useEffect(() => {
        const handleEscOrClick = (e: MouseEvent | KeyboardEvent) => {
            if (e instanceof KeyboardEvent && e.key !== 'Escape') return;
            router.push('/esports/news');
        };
        if (slug) {
            window.addEventListener('keydown', handleEscOrClick);
            window.addEventListener('click', handleEscOrClick);
        }
        return () => {
            window.removeEventListener('keydown', handleEscOrClick);
            window.removeEventListener('click', handleEscOrClick);
        };
    }, [slug, router]);

    return (
        <div className="max-w-screen-2xl mx-auto px-4 py-12 relative">
            <Title title1="Espor" title2="Haberleri" />

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-10">
                {newsList.map((news) => (
                    <div
                        key={news.slug}
                        onClick={() => router.push(`?haber=${news.slug}`)}
                        className="cursor-pointer bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                    >
                        <div className="relative w-full group">
                            <img
                                src={news.image}
                                alt={news.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                        </div>
                        <div className="p-4">
                            <h3 className="font-semibold text-lg text-gray-900 dark:text-white">{news.title}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-1">{news.summary}</p>
                            <p className="text-sm text-gray-600 dark:text-orange-600 mt-1">{news.author}</p>
                            <span className="text-xs text-gray-400 mt-2 block">{news.date}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedNews && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center"
                    onClick={() => router.push('/news')}
                >
                    <div
                        className="bg-white dark:bg-gray-900 max-w-5xl w-full max-h-[70vh] mx-4 rounded-lg overflow-hidden shadow-xl relative z-60 flex"
                        onClick={(e) => e.stopPropagation()}
                        style={{ minHeight: '468px' }}
                    >
                        {/* Görsel */}
                        <div className="relative w-1/2 h-full">
                            <img
                                src={selectedNews.image}
                                alt={selectedNews.title}
                                className="w-full h-full object-cover "
                            />
                        </div>

                        {/* Sağ: İçerik + yorumlar */}
                        <div className="w-1/2 p-6 max-h-full flex flex-col justify-between">
                            {/* Scrollable alan: açıklama + yorum listesi */}
                            <div className="overflow-y-auto pr-1">
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{selectedNews.title}</h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{selectedNews.date}</p>

                                {/* Açıklama */}
                                <ToggleableContent content={selectedNews.content} />

                                {/* Yorumlar */}
                                <div className="mt-4 border-t pt-4 space-y-3">
                                    {fakeComments.map((comment, index) => (
                                        <div key={index} className="text-sm">
                                            <p className="font-medium text-gray-800 dark:text-white">{comment.author}</p>
                                            <p className="text-gray-700 dark:text-gray-300">{comment.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sabit yorum yazma alanı */}
                            <div className="mt-4 pt-4 border-t flex items-center gap-2">
                                <input
                                    type="text"
                                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-white"
                                    placeholder="Yorumunuzu yazın..."
                                ></input>
                                <button className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 text-sm">
                                    Gönder
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}


        </div>
    );
}
