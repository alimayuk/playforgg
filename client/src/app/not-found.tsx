'use client'
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import '@/app/globals.css';

export default function NotFound() {
    const t = useTranslations('NotFound');

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#212121] text-white px-4 text-center">
            <h1 className="text-8xl font-extrabold tracking-widest text-orange-500 animate-pulse">
                404
            </h1>
            <p className="mt-6 text-2xl font-semibold">{t('notfound')}</p>
            <p className="mt-2 text-gray-400 max-w-md">
                {t('description', { defaultValue: 'The page you are looking for might be removed or is temporarily unavailable.' })}
            </p>
            <Link
                href="/"
                className="mt-8 px-6 py-3 bg-orange-500 text-white font-medium rounded-2xl shadow-lg hover:bg-orange-600 transition"
            >
                {t('backHome')}
            </Link>
        </div>
    );
}
