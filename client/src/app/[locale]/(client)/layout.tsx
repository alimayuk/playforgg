// app/[locale]/layout.tsx
import { hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../../globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = params;

  // Geçerli locale kontrolü
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <div
      style={{
        color: 'white',
        backgroundColor: '#0a0f1c',
        backgroundImage: `
          radial-gradient(circle at 20% 30%, rgba(255, 0, 120, 0.1), transparent 50%),
          radial-gradient(circle at 80% 70%, rgba(0, 140, 255, 0.1), transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.03), transparent 70%)
        `,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundAttachment: 'fixed',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
