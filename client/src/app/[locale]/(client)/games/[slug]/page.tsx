import GameDetailPage from '@/components/pages/client/gameDetail';
import { getLocale } from '@/utils/localeUtils';
import { notFound } from 'next/navigation';

const fetchGame = async (slug: string, locale: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/games/${slug}?locale=${locale}`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        return null;
    }

    return res.json();
};

const Page = async ({ params }: { params: { slug: string } }) => {
    const locale = await getLocale();
    const { slug } = params;

    const game = await fetchGame(slug, locale);
    if (!game) {
        notFound();
    }
    return <GameDetailPage initialData={game} />
};

export default Page
