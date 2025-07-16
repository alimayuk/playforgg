'use client';
import Title from '@/components/Title';
import Link from 'next/link';
import { useState } from 'react';

const categories = ['Tümü', 'Aksiyon', 'RPG', 'Strateji'];

export default function GamesPage() {
    const [selectedCategory, setSelectedCategory] = useState('Tümü');

    const allGames = [
        {
            id: 1,
            title: 'Cyber Warfare Güncellemesi - FPS Aksiyon Oyunu - 2024 Yaz Dönemi',
            category: 'Aksiyon',
            image: 'https://picsum.photos/400/200?random=1',
            description: 'Yüksek tempolu FPS aksiyon oyunu. Hızlı refleksler ve strateji gerektirir. aksiyon dolu savaşlar seni bekliyor! fight for survival in a dystopian future. wage war against rogue AI and cybernetic enemies. join the resistance and fight for humanity\'s future.',
        },
        {
            id: 2,
            title: 'Kingdom Saga',
            category: 'RPG',
            image: 'https://picsum.photos/400/200?random=2',
            description: 'Derin hikayesiyle RPG deneyimi.',
        },
        {
            id: 3,
            title: 'War Tactics',
            category: 'Strateji',
            image: 'https://picsum.photos/400/200?random=3',
            description: 'Gerçek zamanlı strateji savaşları.',
        },
        {
            id: 4,
            title: 'Dark Realms',
            category: 'RPG',
            image: 'https://picsum.photos/400/200?random=4',
            description: 'Gotik dünyada karakter geliştirme.',
        },
        {
            id: 5,
            title: 'Bullet Rush',
            category: 'Aksiyon',
            image: 'https://picsum.photos/400/200?random=5',
            description: 'Reflekslerini konuştur!',
        },
    ];


    const filteredGames =
        selectedCategory === 'Tümü'
            ? allGames
            : allGames.filter((game) => game.category === selectedCategory);

    return (
        <section className=" max-w-screen-2xl mx-auto px-4 py-10">
            <div className="mb-8">
                <Title title1="Tüm" title2="Oyunlar" />
                <div className="flex flex-wrap gap-3">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            className={`px-4 py-1 rounded-full border text-sm transition ${selectedCategory === category
                                ? 'bg-orange-600 text-white border-orange-600'
                                : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white'
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-6">
                {filteredGames.map((game) => (
                    <a href={`/games/${game.id}`} key={game.id} className="group">
                        <div
                            className="relative rounded-xl overflow-hidden cursor-pointer group shadow-lg isolate bg-gray-900 h-96 w-72 transition-transform duration-500 hover:scale-105"
                        >
                            {/* Arka plan resmi */}
                            <img
                                src={game.image}
                                alt={game.title}
                                className="absolute inset-0 w-full h-full object-cover -z-10 transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Karartma overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/70 to-transparent -z-10 rounded-xl"></div>

                            {/* Kategori etiketi */}
                            <span className="absolute top-5 right-5 bg-orange-600 text-white text-sm font-semibold px-3 py-1 rounded-full z-10">
                                {game.category}
                            </span>

                            {/* Alt içerik container */}
                            <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 bg-gradient-to-t from-gray-900/90 to-transparent rounded-b-xl flex flex-col">
                                {/* Başlık */}
                                <h3 className="text-white text-xl font-semibold leading-tight transition-transform duration-500 group-hover:-translate-y-2 line-clamp-3">
                                    {game.title}
                                </h3>

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
                ))}
                {filteredGames.length === 0 && (
                    <p className="text-gray-500 col-span-full">Bu kategoride oyun bulunamadı.</p>
                )}
            </div>
        </section>
    );
}
