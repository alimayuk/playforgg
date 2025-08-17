import { NextIntlClientProvider, useLocale } from 'next-intl';
import './globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const locale = useLocale();
    return (
        <html lang={locale}>
            <body suppressHydrationWarning>
                <NextIntlClientProvider>
                        {children}
                </NextIntlClientProvider>
            </body>
        </html>
    );
}
