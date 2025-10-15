import { Metadata } from 'next';

export interface MetadataConfig {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
  tags?: string[];
  locale?: string;
  alternateLocales?: { locale: string; url: string }[];
}

export interface BlogMetadata extends MetadataConfig {
  type: 'article';
  publishedTime: string;
  modifiedTime?: string;
  author: string;
  section: string;
  tags: string[];
}

export interface FormMetadata extends MetadataConfig {
  type: 'website';
  formType: string;
  formDescription: string;
}

/**
 * Dinamik metadata oluşturur
 */
export function generateMetadata(config: MetadataConfig): Metadata {
  const {
    title,
    description,
    keywords = [],
    image,
    url,
    type = 'website',
    publishedTime,
    modifiedTime,
    author,
    section,
    tags = [],
    locale = 'tr',
    alternateLocales = []
  } = config;

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://playforgg.com';
  const fullUrl = url ? `${baseUrl}${url}` : baseUrl;
  const fullImage = image ? (image.startsWith('http') ? image : `${baseUrl}${image}`) : `${baseUrl}/og-image.jpg`;

  const metadata: Metadata = {
    title: `${title} | PlayForGG`,
    description,
    keywords: keywords.join(', '),
    authors: author ? [{ name: author }] : undefined,
    creator: author,
    publisher: 'PlayForGG',
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: fullUrl,
      languages: alternateLocales.reduce((acc, alt) => {
        acc[alt.locale] = alt.url;
        return acc;
      }, {} as Record<string, string>),
    },
    openGraph: {
      type,
      locale,
      url: fullUrl,
      title,
      description,
      siteName: 'PlayForGG',
      images: [
        {
          url: fullImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(author && { authors: [author] }),
      ...(section && { section }),
      ...(tags.length > 0 && { tags }),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [fullImage],
      creator: '@playforgg',
      site: '@playforgg',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
      yandex: process.env.YANDEX_VERIFICATION,
      yahoo: process.env.YAHOO_VERIFICATION,
    },
  };

  return metadata;
}

/**
 * Blog yazısı için özel metadata oluşturur
 */
export function generateBlogMetadata(blog: {
  title: string;
  excerpt: string;
  content: string;
  image?: string;
  slug: string;
  author: string;
  category: string;
  tags: string[];
  publishedAt: string;
  updatedAt?: string;
  locale: string;
}): Metadata {
  const keywords = [
    'oyun',
    'gaming',
    'esports',
    'blog',
    blog.category.toLowerCase(),
    ...blog.tags.map(tag => tag.toLowerCase())
  ];

  const url = `/${blog.locale}/blogs/${blog.slug}`;
  
  return generateMetadata({
    title: blog.title,
    description: blog.excerpt,
    keywords,
    image: blog.image,
    url,
    type: 'article',
    publishedTime: blog.publishedAt,
    modifiedTime: blog.updatedAt,
    author: blog.author,
    section: blog.category,
    tags: blog.tags,
    locale: blog.locale,
  });
}

/**
 * Form sayfası için özel metadata oluşturur
 */
export function generateFormMetadata(form: {
  title: string;
  description: string;
  formType: string;
  locale: string;
  url: string;
}): Metadata {
  const keywords = [
    'form',
    'başvuru',
    'kayıt',
    form.formType.toLowerCase(),
    'playforgg'
  ];

  return generateMetadata({
    title: form.title,
    description: form.description,
    keywords,
    url: form.url,
    type: 'website',
    locale: form.locale,
  });
}

/**
 * Blog listesi sayfası için metadata oluşturur
 */
export function generateBlogListMetadata(config: {
  title: string;
  description: string;
  keywords: string[];
  url: string;
  locale: string;
}): Metadata {
  return generateMetadata({
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    url: config.url,
    locale: config.locale,
  });
}

/**
 * Ana sayfa için metadata oluşturur
 */
export function generateHomeMetadata(locale: string): Metadata {
  const translations = {
    tr: {
      title: 'PlayForGG - Oyun Dünyasının Merkezi',
      description: 'En yeni oyun haberleri, incelemeler, rehberler ve topluluk. Oyun dünyasında her şey burada!',
      keywords: ['oyun', 'gaming', 'esports', 'oyun haberleri', 'oyun incelemeleri', 'oyun rehberleri']
    },
    en: {
      title: 'PlayForGG - Gaming Hub',
      description: 'Latest gaming news, reviews, guides and community. Everything about gaming is here!',
      keywords: ['gaming', 'esports', 'game news', 'game reviews', 'game guides', 'gaming community']
    }
  };

  const t = translations[locale as keyof typeof translations] || translations.tr;

  return generateMetadata({
    title: t.title,
    description: t.description,
    keywords: t.keywords,
    url: `/${locale}`,
    locale,
  });
}

/**
 * JSON-LD structured data oluşturur
 */
export function generateJsonLd(config: {
  type: 'Article' | 'WebSite' | 'Organization' | 'BreadcrumbList';
  data: any;
}) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://playforgg.com';
  
  const jsonLdTemplates = {
    Article: {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: config.data.title,
      description: config.data.description,
      image: config.data.image,
      author: {
        '@type': 'Person',
        name: config.data.author
      },
      publisher: {
        '@type': 'Organization',
        name: 'PlayForGG',
        logo: {
          '@type': 'ImageObject',
          url: `${baseUrl}/logo.png`
        }
      },
      datePublished: config.data.publishedTime,
      dateModified: config.data.modifiedTime,
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': config.data.url
      }
    },
    WebSite: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'PlayForGG',
      url: baseUrl,
      description: config.data.description,
      potentialAction: {
        '@type': 'SearchAction',
        target: `${baseUrl}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string'
      }
    },
    Organization: {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'PlayForGG',
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: 'Gaming community and content platform',
      sameAs: [
        'https://twitter.com/playforgg',
        'https://facebook.com/playforgg',
        'https://instagram.com/playforgg'
      ]
    }
  };

  return jsonLdTemplates[config.type] || {};
}
