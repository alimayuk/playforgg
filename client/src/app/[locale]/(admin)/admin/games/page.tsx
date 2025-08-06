import Games from '@/components/pages/admin/Games';
import { cookies } from 'next/headers';

const fetchGames = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "tr";

  console.log(`Fetching games for locale: ${locale}`);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/games?locale=${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Oyunlar alınamadı');
  }

  return res.json();
};

const Page = async () => {
  const games = await fetchGames();
  return <Games gamesData={games} />;
};

export default Page;
