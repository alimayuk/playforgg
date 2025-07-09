'use client';

import { useState } from 'react';
import Link from 'next/link';
import Title from '@/components/Title';

const blogs = [
  {
    id: 1,
    title: 'CS2 Takım Taktikleri',
    summary: 'CS2’de rakibi okumayı öğrenin. Harita kontrolü, ekonomi yönetimi ve daha fazlası...',
    image: 'https://picsum.photos/seed/cs2/800/450',
    date: '07.07.2025',
    category: 'Rehber',
    slug: 'cs2-takim-taktikleri',
  },
  {
    id: 2,
    title: 'Valorant Yeni Ajan Analizi',
    summary: 'Yeni gelen ajanın yetenekleri neler? Oyuna etkisi ne olacak? Hepsi bu yazıda.',
    image: 'https://picsum.photos/seed/valorant/800/450',
    date: '06.07.2025',
    category: 'Haber',
    slug: 'valorant-yeni-ajan',
  },
  {
    id: 3,
    title: 'LoL Makro Stratejiler',
    summary: 'Sadece skor almakla oyun kazanılmaz. Makro oyun nedir, nasıl geliştirilir?',
    image: 'https://picsum.photos/seed/lol/800/450',
    date: '05.07.2025',
    category: 'Kılavuz',
    slug: 'lol-makro-strateji',
  },
  {
    id: 4,
    title: 'Dota 2 Yeni Sezon Rehberi',
    summary: 'Yeni sezonun getirdiği değişiklikler, meta analizi ve en iyi kahramanlar.',
    image: 'https://picsum.photos/seed/dota2/800/450',
    date: '04.07.2025',
    category: 'Rehber',
    slug: 'dota2-yeni-sezon-rehberi',
  },
  {
    id: 5,
    title: 'PUBG Yeni Harita İncelemesi',
    summary: 'Yeni haritada neler var? Stratejiler, loot bölgeleri ve en iyi drop noktaları.',
    image: 'https://picsum.photos/seed/pubg/800/450',
    date: '03.07.2025',
    category: 'Haber',
    slug: 'pubg-yeni-harita',
  },
  {
    id: 6,
    title: 'Apex Legends Sezon 17 İncelemesi',
    summary: 'Yeni sezonun getirdiği yenilikler, karakter değişiklikleri ve meta analizi.',
    image: 'https://picsum.photos/seed/apex/800/450',
    date: '02.07.2025',
    category: 'Haber',
    slug: 'apex-legends-sezon-17',
  },
  {
    id: 7,
    title: 'FIFA 24 Kariyer Modu İpuçları',
    summary: 'Kariyer modunda nasıl başarılı olunur? Transfer stratejileri ve takım yönetimi.',
    image: 'https://picsum.photos/seed/fifa24/800/450',
    date: '01.07.2025',
    category: 'Kılavuz',
    slug: 'fifa24-kariyer-modu-ipuclari',
  },
  {
    id: 8,
    title: 'Overwatch 2 Yeni Harita Rehberi',
    summary: 'Yeni haritada nasıl oynanır? Stratejiler ve en iyi hero seçimleri.',
    image: 'https://picsum.photos/seed/overwatch/800/450',
    date: '30.06.2025',
    category: 'Rehber',
    slug: 'overwatch2-yeni-harita-rehberi',
  },
  {
    id: 9,
    title: 'Rocket League Yeni Araba İncelemesi',
    summary: 'Yeni arabanın özellikleri, en iyi kullanım taktikleri ve meta analizi.',
    image: 'https://picsum.photos/seed/rocketleague/800/450',
    date: '29.06.2025',
    category: 'Haber',
    slug: 'rocket-league-yeni-araba',
  },
  {
    id: 10,
    title: 'Hearthstone Yeni Kart Seti Rehberi',
    summary: 'Yeni kart setinin getirdiği yenilikler, stratejiler ve en iyi desteler.',
    image: 'https://picsum.photos/seed/hearthstone/800/450',
    date: '28.06.2025',
    category: 'Kılavuz',
    slug: 'hearthstone-yeni-kart-seti',
  },
  {
    id: 11,
    title: 'Elden Ring Build Rehberi',
    summary: 'Hangi silahlarla hangi build daha etkili? PvP ve PvE için öneriler.',
    image: 'https://picsum.photos/seed/eldenring/800/450',
    date: '27.06.2025',
    category: 'Rehber',
    slug: 'elden-ring-build-rehberi',
  },
  {
    id: 12,
    title: 'Minecraft 1.21 Güncellemesi',
    summary: 'Yeni biyomlar, düşmanlar ve yaratıcı mod yenilikleri.',
    image: 'https://picsum.photos/seed/minecraft/800/450',
    date: '26.06.2025',
    category: 'Haber',
    slug: 'minecraft-1-21-guncellemesi',
  },
  {
    id: 13,
    title: 'GTA 6 Sızdırılan Bilgiler',
    summary: 'Harita detayları, oynanış ipuçları ve karakter analizleri.',
    image: 'https://picsum.photos/seed/gta6/800/450',
    date: '25.06.2025',
    category: 'Haber',
    slug: 'gta6-sizdirilan-bilgiler',
  },
  {
    id: 14,
    title: 'Fortnite En İyi Silahlar',
    summary: '2025 sezonunda öne çıkan silahlar ve kullanım ipuçları.',
    image: 'https://picsum.photos/seed/fortnite/800/450',
    date: '24.06.2025',
    category: 'Kılavuz',
    slug: 'fortnite-en-iyi-silahlar',
  },
  {
    id: 15,
    title: 'Starfield İlk İzlenimler',
    summary: 'Bethesda’nın uzay RPG’si nasıl olmuş? Grafik, oynanış ve daha fazlası.',
    image: 'https://picsum.photos/seed/starfield/800/450',
    date: '23.06.2025',
    category: 'İnceleme',
    slug: 'starfield-ilk-izlenimler',
  },
  {
    id: 16,
    title: 'The Witcher 4 Beklentiler',
    summary: 'Yeni oyun hakkında teoriler, karakter tahminleri ve evrenin geleceği.',
    image: 'https://picsum.photos/seed/witcher4/800/450',
    date: '22.06.2025',
    category: 'Spekülasyon',
    slug: 'witcher4-beklentiler',
  },
  {
    id: 17,
    title: 'League of Legends Yeni Şampiyon',
    summary: 'Yeni LoL şampiyonu kim? Yetenekler, rolü ve meta etkisi.',
    image: 'https://picsum.photos/seed/lolchampion/800/450',
    date: '21.06.2025',
    category: 'Haber',
    slug: 'lol-yeni-sampiyon',
  },
  {
    id: 18,
    title: 'Cyberpunk 2077 Phantom Liberty İncelemesi',
    summary: 'Yeni DLC’de bizi neler bekliyor? V’deki değişiklikler ve hikaye analizi.',
    image: 'https://picsum.photos/seed/cyberpunk/800/450',
    date: '20.06.2025',
    category: 'İnceleme',
    slug: 'cyberpunk-phantom-liberty',
  },
  {
    id: 19,
    title: 'Battlefield 2042 Yeni Modlar',
    summary: 'Yeni oyun modları ne kadar heyecan verici? Harita ve ekipman detayları.',
    image: 'https://picsum.photos/seed/battlefield/800/450',
    date: '19.06.2025',
    category: 'Haber',
    slug: 'battlefield-2042-yeni-modlar',
  },
  {
    id: 20,
    title: 'Zelda: Tears of the Kingdom Taktikleri',
    summary: 'Bulmacalar, boss savaşları ve keşif için ipuçları.',
    image: 'https://picsum.photos/seed/zelda/800/450',
    date: '18.06.2025',
    category: 'Kılavuz',
    slug: 'zelda-totk-taktikleri',
  },
];


const categories = ['Tümü', 'Rehber', 'Haber', 'Kılavuz'];
const postsPerPage = 9;

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState('Tümü');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = selectedCategory === 'Tümü'
    ? blogs
    : blogs.filter((b) => b.category === selectedCategory);

  const totalPages = Math.ceil(filtered.length / postsPerPage);
  const paginated = filtered.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  const changePage = (dir: 'prev' | 'next') => {
    setCurrentPage((prev) => {
      if (dir === 'prev') return Math.max(prev - 1, 1);
      if (dir === 'next') return Math.min(prev + 1, totalPages);
      return prev;
    });
  };

  return (
  <div className="max-w-screen-2xl mx-auto px-4 py-12">
    {/* Başlık */}
    <Title title1="Blog" title2="Yazıları" />

    {/* Filtre */}
    <div className="flex gap-4 mb-8 flex-wrap">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => {
            setSelectedCategory(cat);
            setCurrentPage(1);
          }}
          className={`px-4 py-1.5 rounded-full border text-sm font-medium transition ${
            selectedCategory === cat
              ? 'bg-orange-600 text-white border-orange-600'
              : 'bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>

    {/* Blog Kartları */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
      {paginated.map((blog) => (
        <div
          key={blog.id}
          className="bg-[#1e293b] rounded-xl shadow-md hover:shadow-lg transition"
        >
          <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-48 object-cover rounded-t-xl"
          />
          <div className="p-4">
            <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
              <span className="font-medium">{blog.category}</span>
              <span>{blog.date}</span>
            </div>
            <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{blog.title}</h3>
            <p className="text-sm text-gray-300 mb-4 line-clamp-3">{blog.summary}</p>
            <Link
              href={`/blogs/${blog.slug}`}
              className="text-orange-500 font-semibold hover:text-orange-400 hover:underline"
            >
              Devamını Oku →
            </Link>
          </div>
        </div>
      ))}
    </div>

    {/* Sayfalama */}
    {totalPages > 1 && (
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => changePage('prev')}
          disabled={currentPage === 1}
          className="px-4 py-2 rounded bg-gray-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-600 transition"
        >
          ← Önceki
        </button>
        <span className="text-sm text-gray-300">
          Sayfa {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => changePage('next')}
          disabled={currentPage === totalPages}
          className="px-4 py-2 rounded bg-gray-700 text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed text-gray-300 hover:bg-gray-600 transition"
        >
          Sonraki →
        </button>
      </div>
    )}
  </div>
);

}
