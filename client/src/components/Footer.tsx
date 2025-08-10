'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { ChangeEvent, useTransition } from 'react';
import { Locale } from 'next-intl';

import {
  Globe,
  ShieldCheck,
  Mail,
  Building2,
  Instagram,
  X,
  Youtube,
} from 'lucide-react';
import { TikTokOutlined } from '@ant-design/icons';

export default function Footer() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [isPending, startTransition] = useTransition();

  function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
    const nextLocale = event.target.value as Locale;
    startTransition(() => {
      router.replace({ pathname }, { locale: nextLocale });
    });
  }

  return (
    <footer className="bg-gray-900 rounded-xl my-5 text-white py-6 px-4 tracking-wide text-sm max-w-screen-2xl mx-auto">
      <div className="w-full mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-0">

        {/* Sol - Linkler */}
        <ul className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 text-gray-400">
          <li className="flex items-center gap-1 hover:text-white transition cursor-pointer">
            <ShieldCheck size={14} />
            <a href="#">Terms</a>
          </li>
          <li className="flex items-center gap-1 hover:text-white transition cursor-pointer">
            <ShieldCheck size={14} />
            <a href="#">Privacy</a>
          </li>
          <li className="flex items-center gap-1 hover:text-white transition cursor-pointer">
            <Mail size={14} />
            <a href="#">Contact</a>
          </li>
          <li className="flex items-center gap-1 hover:text-white transition cursor-pointer">
            <Building2 size={14} />
            <a href="#">Company</a>
          </li>
        </ul>

        {/* Sağ - Dil seçici */}
        <div className="flex items-center justify-center md:justify-start gap-2">
          <Globe className="text-gray-300" size={16} />
          <select
            className="bg-[#1e293b] border border-gray-600 rounded px-3 py-1 text-white text-sm"
            value={locale}
            disabled={isPending}
            onChange={onSelectChange}
          >
            <option value="en">{t('en')}</option>
            <option value="tr">{t('tr')}</option>
          </select>
        </div>
      </div>

      {/* Alt Telif */}
      <div className="border-t border-white/10 mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0 text-gray-500 text-xs">
        <div>© {new Date().getFullYear()} playforgg. All rights reserved.</div>

        {/* Orta - Sosyal */}
        <ul className="flex justify-center md:justify-end gap-6 text-gray-400">
          <li>
            <a href="#" className="hover:text-blue-500 transition" aria-label="Instagram">
              <Instagram size={20} />
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-sky-400 transition" aria-label="X">
              <X size={20} />
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-500 transition" aria-label="Youtube">
              <Youtube size={20} />
            </a>
          </li>
          <li>
            <a href="#" className="hover:text-blue-500 transition" aria-label="Tiktok">
              <TikTokOutlined style={{ fontSize: 20 }} />
            </a>
          </li>
        </ul>
      </div>
    </footer>
  );
}
