import { cookies } from 'next/headers';
import ArticlesPage from '@/components/pages/client/articles';

const fetchArticles = async () => {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "tr";
  
  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/articles?locale=${locale}`, {
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
  const articles = await fetchArticles();
  console.log(articles)
  return <ArticlesPage initialData={articles} />;
};

export default Page;
