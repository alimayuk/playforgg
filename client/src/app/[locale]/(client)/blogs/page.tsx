import { getLocale } from '@/utils/localeUtils';
import BlogPage from '@/components/pages/client/blogs';
import { generateMetadata as generateBlogListMetadata } from '@/utils/metadataUtils';
import { Metadata } from 'next';

const fetchBlogs = async () => {
  const locale = getLocale();

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/blogs?locale=${locale}`, {
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

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  
  const translations = {
    tr: {
      title: 'Blog Yazıları - PlayForGG',
      description: 'En güncel oyun haberleri, incelemeler ve rehberler. Oyun dünyasından son gelişmeleri takip edin.',
      keywords: ['oyun blog', 'gaming blog', 'oyun haberleri', 'oyun incelemeleri', 'oyun rehberleri', 'esports']
    },
    en: {
      title: 'Blog Posts - PlayForGG',
      description: 'Latest gaming news, reviews and guides. Stay updated with the latest developments in the gaming world.',
      keywords: ['gaming blog', 'game news', 'game reviews', 'game guides', 'esports', 'gaming community']
    }
  };

  const t = translations[locale as keyof typeof translations] || translations.tr;

  return generateBlogListMetadata({
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    url: `/${locale}/blogs`,
    locale,
  });
}

const Page = async () => {
  const blogs = await fetchBlogs();
  return <BlogPage initialData={blogs} />;
};

export default Page;
