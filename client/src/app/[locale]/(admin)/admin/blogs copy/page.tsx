import Blogs from '@/components/adminPages/Blogs';
import { cookies } from 'next/headers';

const fetchBlogs = async () => {
  const cookieStore = cookies();
  const token = cookieStore.get('token')?.value;
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "tr";

  console.log(`Fetching blogs for locale: ${locale}`);

  const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/blogs?locale=${locale}`, {
    headers: {
      Authorization: `Bearer ${token}`,
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
  const blogs = await fetchBlogs();
  console.log(`Fetched blogs:`, blogs);
  return <Blogs blogsData={blogs} />;
};

export default Page;
