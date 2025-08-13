import GameDetailPage from '@/components/pages/client/gameDetail';
import { cookies } from 'next/headers';

const fetchGame = async (slug: string, locale: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/games/${slug}?locale=${locale}`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Blog alınamadı');
    }

    return res.json();
};

const Page = async ({ params }: { params: { slug: string } }) => {
    const cookieStore = cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'tr';
    const { slug } = params;

    const game = await fetchGame(slug, locale);
    return <GameDetailPage initialData={game} />
};

export default Page
