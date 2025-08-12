import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import '../globals.css';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { getUser } from '../lib/getUser';
import UserHydration from '@/components/UserHydration';
import AuthListener from '@/components/AuthListener';

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const user = await getUser();
  return (
    <html lang={locale}>
      <body suppressHydrationWarning={true}>
        <NextIntlClientProvider>
          <AntdRegistry>
            <UserHydration user={user} />
            <AuthListener />
            {children}
          </AntdRegistry>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}