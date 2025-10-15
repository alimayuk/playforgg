# Metadata Yönetimi Kullanım Kılavuzu

Bu dokümantasyon, PlayForGG projesinde dinamik metadata yönetiminin nasıl kullanılacağını açıklar.

## Genel Bakış

Metadata sistemi, Next.js 14 App Router yapısında SEO-friendly sayfalar oluşturmak için tasarlanmıştır. Her sayfa türü için özelleştirilmiş metadata fonksiyonları bulunmaktadır.

## Kullanılabilir Fonksiyonlar

### 1. `generateMetadata()` - Genel Metadata
Temel metadata oluşturur.

```typescript
import { generateMetadata } from '@/utils/metadataUtils';

const metadata = generateMetadata({
  title: 'Sayfa Başlığı',
  description: 'Sayfa açıklaması',
  keywords: ['anahtar', 'kelimeler'],
  image: '/path/to/image.jpg',
  url: '/sayfa-url',
  type: 'website',
  locale: 'tr'
});
```

### 2. `generateBlogMetadata()` - Blog Yazıları
Blog yazıları için özelleştirilmiş metadata.

```typescript
import { generateBlogMetadata } from '@/utils/metadataUtils';

const blogData = {
  title: 'Blog Başlığı',
  excerpt: 'Blog özeti',
  content: 'Blog içeriği',
  image: '/blog-image.jpg',
  slug: 'blog-slug',
  author: 'Yazar Adı',
  category: 'Kategori',
  tags: ['etiket1', 'etiket2'],
  publishedAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-02T00:00:00Z',
  locale: 'tr'
};

const metadata = generateBlogMetadata(blogData);
```

### 3. `generateFormMetadata()` - Form Sayfaları
Form sayfaları için özelleştirilmiş metadata.

```typescript
import { generateFormMetadata } from '@/utils/metadataUtils';

const metadata = generateFormMetadata({
  title: 'Form Başlığı',
  description: 'Form açıklaması',
  formType: 'kayıt',
  formDescription: 'Form detay açıklaması',
  locale: 'tr',
  url: '/tr/register'
});
```

### 4. `generateHomeMetadata()` - Ana Sayfa
Ana sayfa için özelleştirilmiş metadata.

```typescript
import { generateHomeMetadata } from '@/utils/metadataUtils';

const metadata = generateHomeMetadata('tr');
```

## Sayfa Türlerine Göre Kullanım

### Blog Detay Sayfası
```typescript
// app/[locale]/(client)/blogs/[slug]/page.tsx
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

  const blogData = {
    title: blog.data.title,
    excerpt: blog.data.excerpt,
    // ... diğer blog verileri
  };

  return generateBlogMetadata(blogData);
}
```

### Form Sayfası
```typescript
// app/[locale]/(auth)/register/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  
  return generateFormMetadata({
    title: 'Kayıt Ol - PlayForGG',
    description: 'PlayForGG topluluğuna katılın!',
    formType: 'kayıt',
    formDescription: 'Yeni hesap oluşturma formu',
    locale,
    url: `/${locale}/register`,
  });
}
```

### Ana Sayfa
```typescript
// app/[locale]/(client)/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  return generateHomeMetadata(locale);
}
```

## JSON-LD Structured Data

Blog yazıları için otomatik olarak JSON-LD structured data oluşturulur:

```typescript
import { generateJsonLd } from '@/utils/metadataUtils';

const jsonLd = generateJsonLd({
  type: 'Article',
  data: {
    title: 'Blog Başlığı',
    description: 'Blog açıklaması',
    image: '/blog-image.jpg',
    author: 'Yazar Adı',
    publishedTime: '2024-01-01T00:00:00Z',
    modifiedTime: '2024-01-02T00:00:00Z',
    url: '/tr/blogs/blog-slug',
  }
});

// Component içinde kullanım
return (
  <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd),
      }}
    />
    <YourComponent />
  </>
);
```

## Çoklu Dil Desteği

Metadata sistemi otomatik olarak çoklu dil desteği sağlar:

```typescript
const translations = {
  tr: {
    title: 'Türkçe Başlık',
    description: 'Türkçe açıklama',
    keywords: ['türkçe', 'anahtar', 'kelimeler']
  },
  en: {
    title: 'English Title',
    description: 'English description',
    keywords: ['english', 'keywords']
  }
};

const t = translations[locale as keyof typeof translations] || translations.tr;
```

## SEO Özellikleri

Metadata sistemi aşağıdaki SEO özelliklerini içerir:

- **Open Graph** etiketleri (Facebook, LinkedIn)
- **Twitter Card** etiketleri
- **Canonical URL** yönetimi
- **Alternate Language** etiketleri
- **JSON-LD** structured data
- **Robots** direktifleri
- **Verification** kodları (Google, Yandex, Yahoo)

## Environment Variables

Aşağıdaki environment variable'ları `.env.local` dosyasında tanımlayın:

```env
NEXT_PUBLIC_SITE_URL=https://playforgg.com
GOOGLE_SITE_VERIFICATION=your_google_verification_code
YANDEX_VERIFICATION=your_yandex_verification_code
YAHOO_VERIFICATION=your_yahoo_verification_code
```

## Örnekler

### Yeni Bir Blog Kategorisi Sayfası
```typescript
// app/[locale]/(client)/blogs/category/[slug]/page.tsx
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const locale = getLocale();
  const { slug } = params;
  
  const category = await fetchCategory(slug, locale);
  
  return generateMetadata({
    title: `${category.name} Kategorisi - PlayForGG`,
    description: `${category.name} kategorisindeki tüm blog yazıları`,
    keywords: [category.name, 'blog', 'kategori'],
    url: `/${locale}/blogs/category/${slug}`,
    locale
  });
}
```

### Yeni Bir Form Sayfası
```typescript
// app/[locale]/(client)/contact/page.tsx
export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  
  return generateFormMetadata({
    title: 'İletişim - PlayForGG',
    description: 'Bizimle iletişime geçin',
    formType: 'iletişim',
    formDescription: 'İletişim formu',
    locale,
    url: `/${locale}/contact`
  });
}
```

Bu sistem sayesinde her sayfa için otomatik olarak SEO-friendly metadata oluşturulur ve arama motorları tarafından daha iyi indexlenir.
