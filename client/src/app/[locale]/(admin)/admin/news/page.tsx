import Articles from '@/components/pages/admin/Articles';
import { cookies } from 'next/headers';

const fetchArticles = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "tr";


  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/articles?locale=${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    cache: 'no-store',
  });
 
  if (!res.ok) {
    throw new Error('Haberler alınamadı');
  }

  return res.json();
};

const Page = async () => {
  const articles = await fetchArticles();

  return <Articles initialData={articles} />;
};

export default Page;
