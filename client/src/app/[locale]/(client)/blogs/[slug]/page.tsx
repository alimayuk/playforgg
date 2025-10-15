import BlogDetailPage from '@/components/pages/client/blogDetail';
import { getLocale } from '@/utils/localeUtils';
import { notFound } from 'next/navigation';
import { generateBlogMetadata, generateJsonLd } from '@/utils/metadataUtils';
import { Metadata } from 'next';

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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const locale = getLocale();
    const { slug } = params;

    const blog = await fetchBlog(slug, locale);

    if (!blog) {
        return {
            title: 'Blog Bulunamadı',
            description: 'Aradığınız blog yazısı bulunamadı.',
        };
    }

    // Blog verisini metadata formatına dönüştür
    const blogData = {
        title: blog.data.title,
        excerpt: blog.data.excerpt,
        content: blog.data.content,
        image: blog.data.image,
        slug: blog.data.slug,
        author: blog.data.author?.name || 'PlayForGG',
        category: blog.data.category?.title || 'Genel',
        tags: blog.data.tags || [],
        publishedAt: blog.data.created_at,
        updatedAt: blog.data.updated_at,
        locale: locale,
    };

    return generateBlogMetadata(blogData);
}

const Page = async ({ params }: { params: { slug: string } }) => {
    const locale = getLocale();
    const { slug } = params;

    const blog = await fetchBlog(slug, locale);

    if (!blog) {
        notFound();
    }

    // JSON-LD structured data için blog verisini hazırla
    const blogData = {
        title: blog.data.title,
        description: blog.data.excerpt,
        image: blog.data.image,
        author: blog.data.author?.name || 'PlayForGG',
        publishedTime: blog.data.created_at,
        modifiedTime: blog.data.updated_at,
        url: `/${locale}/blogs/${blog.data.slug}`,
    };

    const jsonLd = generateJsonLd({
        type: 'Article',
        data: blogData,
    });

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(jsonLd),
                }}
            />
            <BlogDetailPage initialData={blog} />
        </>
    );
};

export default Page