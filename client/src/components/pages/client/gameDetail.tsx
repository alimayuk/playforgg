'use client';
import Link from 'next/link';
import Empty from '@/components/Empty';
import { GameDetailResponse } from '@/types';

type Props = {
    initialData: GameDetailResponse
};

export default function GameDetailPage({ initialData }: Props) {
    const { data: game, otherGames } = initialData;


    if (!game) {
        return (
            <div className="max-w-screen-2xl mx-auto px-4 py-12">
                <Empty
                    title="game bulunamadı"
                    description="Aradığınız game yazısı mevcut değil veya silinmiş olabilir."
                    actionText="gamelara Geri Dön"
                    actionHref="/games"
                />
            </div>
        );
    }

    return (
        <div className="max-w-screen-2xl mx-auto px-4 py-12 grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Main Content */}
            <div className="lg:col-span-3 space-y-8 text-gray-200">
                {/* game Content */}
                <div>
                    <img
                        src={
                            game.image
                                ? `${process.env.NEXT_PUBLIC_GLOBAL_SERVER_URL}/${game.image}`
                                : 'https://via.placeholder.com/800x450?text=No+Image'
                        }
                        alt={game.title}
                        className="w-full h-72 object-cover object-top rounded-xl mb-6"
                    />
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                        <span>{game.category.title}</span>
                        <span>{game.created_at}</span>
                    </div>
                    <h1 className="text-3xl font-bold mb-4 text-white">{game.title}</h1>
                    <div className='prose max-w-none text-white'>
                        <div dangerouslySetInnerHTML={{ __html: game.content }} />
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
                                        <p className="text-sm text-gray-500">{b.created_at}</p>
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