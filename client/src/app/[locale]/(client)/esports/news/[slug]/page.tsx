'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const fakeNews = [
  {
    slug: 'zywoo-naviye-transfer-oldu',
    title: 'ZywOo, NAVI\'ye Transfer Oldu!',
    date: '04.07.2025',
    game: 'CS2',
    image: 'https://img-cdn.hltv.org/gallerypicture/Cg7PkhWdGJXwTp_JsPR7v9.jpg',
    content: `ZywOo, büyük bir sürprizle NAVI takımına transfer oldu. Bu gelişme, CS2 sahnesini büyük ölçüde etkileyecek gibi duruyor.`,
  },
  {
    slug: 'valorant-yeni-ajan-cok-op',
    title: 'Valorant\'ın Yeni Ajanı Dengesiz mi?',
    date: '03.07.2025',
    game: 'VALORANT',
    image: 'https://via.placeholder.com/600x300.png?text=Valorant+News',
    content: `Yeni ajan oyun dengesini bozmuş olabilir. Oyuncuların büyük tepkisi var.`,
  },
  // ...
];

export default function NewsDetailPage() {
  const params = useParams();
  const slug = params?.slug;
  const news = fakeNews.find((n) => n.slug === slug);

  if (!news) {
    return <p className="text-white text-center py-12">Haber bulunamadı.</p>;
  }

  return (
    <div className="max-w-screen-md mx-auto px-4 py-12 text-white space-y-6">
      <Link href="/esports/news" className="text-orange-500 hover:underline text-sm">
        ← Tüm Haberlere Dön
      </Link>

      <img
        src={news.image}
        alt={news.title}
        className="w-full h-64 object-cover rounded-lg"
      />

      <h1 className="text-2xl font-bold">{news.title}</h1>
      <p className="text-sm text-gray-400">{news.date} • {news.game}</p>
      <p className="leading-relaxed whitespace-pre-line">{news.content}</p>
    </div>
  );
}
