import ArticlesPage from '@/components/pages/client/articles';
import { getLocale } from '@/utils/localeUtils';

const fetchArticles = async () => {
  const locale = getLocale();

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
  return <ArticlesPage initialData={articles} />;
};

export default Page;
