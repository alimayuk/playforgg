import { NextIntlClientProvider, useLocale } from 'next-intl';
import './globals.css'
import { Metadata } from 'next';
import { generateHomeMetadata } from '@/utils/metadataUtils';

export const metadata: Metadata = {
  title: {
    default: 'PlayForGG - Oyun Dünyasının Merkezi',
    template: '%s | PlayForGG'
  },
  description: 'En yeni oyun haberleri, incelemeler, rehberler ve topluluk. Oyun dünyasında her şey burada!',
  keywords: ['oyun', 'gaming', 'esports', 'oyun haberleri', 'oyun incelemeleri', 'oyun rehberleri'],
  authors: [{ name: 'PlayForGG Team' }],
  creator: 'PlayForGG',
  publisher: 'PlayForGG',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://playforgg.com'),
  openGraph: {
    type: 'website',
    locale: 'tr_TR',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://playforgg.com',
    title: 'PlayForGG - Oyun Dünyasının Merkezi',
    description: 'En yeni oyun haberleri, incelemeler, rehberler ve topluluk. Oyun dünyasında her şey burada!',
    siteName: 'PlayForGG',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'PlayForGG - Oyun Dünyasının Merkezi',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'PlayForGG - Oyun Dünyasının Merkezi',
    description: 'En yeni oyun haberleri, incelemeler, rehberler ve topluluk. Oyun dünyasında her şey burada!',
    images: ['/og-image.jpg'],
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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = useLocale();
    return (
        <html lang={locale}>
            <head>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            '@context': 'https://schema.org',
                            '@type': 'Organization',
                            name: 'PlayForGG',
                            url: process.env.NEXT_PUBLIC_SITE_URL || 'https://playforgg.com',
                            logo: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://playforgg.com'}/logo.png`,
                            description: 'Gaming community and content platform',
                            sameAs: [
                                'https://twitter.com/playforgg',
                                'https://facebook.com/playforgg',
                                'https://instagram.com/playforgg'
                            ]
                        })
                    }}
                />
            </head>
            <body suppressHydrationWarning>
                <NextIntlClientProvider>
                        {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
