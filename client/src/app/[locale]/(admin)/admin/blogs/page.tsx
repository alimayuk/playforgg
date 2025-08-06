import Blogs from '@/components/pages/admin/Blogs';
import { cookies } from 'next/headers';

const fetchBlogs = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'tr';

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blogs?locale=${locale}&page=1&perPage=5`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
    credentials: 'include',
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Bloglar alınamadı');
  }

  const json = await res.json();

  return {
    blogs: json.data,
    meta: json.meta,
    locale,
  };
};

const Page = async () => {
  const { blogs, meta, locale } = await fetchBlogs();
  return <Blogs initialData={blogs} initialMeta={meta} locale={locale} />;
};

export default Page;
