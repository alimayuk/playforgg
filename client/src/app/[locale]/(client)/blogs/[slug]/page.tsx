import BlogDetailPage from '@/components/pages/client/blogDetail';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';

const fetchBlog = async (slug: string, locale: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/blogs/${slug}?locale=${locale}`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        return null; // veya throw new Error('Blog alınamadı');
    }

    return res.json();
};

const Page = async ({ params }: { params: { slug: string } }) => {
    const cookieStore = cookies();
    const locale = cookieStore.get('NEXT_LOCALE')?.value || 'tr';
    const { slug } = params;

    const blog = await fetchBlog(slug, locale);
    
    if (!blog) {
        notFound();
    }
    
    return <BlogDetailPage initialData={blog} />
};

export default Page