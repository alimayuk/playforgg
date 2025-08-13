import { cookies } from 'next/headers';
import GamesPage from '@/components/pages/client/games';

const fetchGames = async () => {
    const cookieStore = cookies();
    const locale = cookieStore.get("NEXT_LOCALE")?.value || "tr";

    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/games?locale=${locale}`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        throw new Error('Bloglar alınamadı');
    }

    return res.json();
};

const Page = async () => {
    const games = await fetchGames();
    return <GamesPage initialData={games} />;
};

export default Page;
