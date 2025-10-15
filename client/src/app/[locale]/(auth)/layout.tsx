import { Metadata } from 'next';
import { getLocale } from '@/utils/localeUtils';

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  
  const translations = {
    tr: {
      title: 'Giriş Yap - PlayForGG',
      description: 'PlayForGG hesabınıza giriş yapın ve oyun dünyasının keyfini çıkarın.',
    },
    en: {
      title: 'Login - PlayForGG',
      description: 'Sign in to your PlayForGG account and enjoy the gaming world.',
    }
  };

  const t = translations[locale as keyof typeof translations] || translations.tr;

  return {
    title: t.title,
    description: t.description,
    robots: {
      index: false, // Auth sayfaları arama motorlarında indexlenmemeli
      follow: false,
    },
  };
}

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  );
}