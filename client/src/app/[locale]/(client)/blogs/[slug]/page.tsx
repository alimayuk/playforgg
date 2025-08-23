import BlogDetailPage from '@/components/pages/client/blogDetail';
import { getLocale } from '@/utils/localeUtils';
import { notFound } from 'next/navigation';

const fetchBlog = async (slug: string, locale: string) => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/client/blogs/${slug}?locale=${locale}`, {
        headers: {
            Accept: 'application/json',
        },
        cache: 'no-store',
    });

    if (!res.ok) {
        return null;
    }

    return res.json();
};

const Page = async ({ params }: { params: { slug: string } }) => {
    const locale = getLocale();
    const { slug } = params;

    const blog = await fetchBlog(slug, locale);

    if (!blog) {
        notFound();
    }

    return <BlogDetailPage initialData={blog} />
};

export default Page