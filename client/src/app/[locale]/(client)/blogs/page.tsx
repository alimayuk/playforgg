import { cookies } from 'next/headers';
import BlogPage from '@/components/pages/client/blogs';

const fetchBlogs = async () => {
  const cookieStore = cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "tr";
  
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

const Page = async () => {
  const blogs = await fetchBlogs();
  return <BlogPage initialData={blogs} />;
};

export default Page;
