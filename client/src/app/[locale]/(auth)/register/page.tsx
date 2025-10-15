import React from 'react';
import { generateFormMetadata } from '@/utils/metadataUtils';
import { Metadata } from 'next';
import { getLocale } from '@/utils/localeUtils';

export async function generateMetadata(): Promise<Metadata> {
  const locale = getLocale();
  
  const translations = {
    tr: {
      title: 'Kayıt Ol - PlayForGG',
      description: 'PlayForGG topluluğuna katılın! Ücretsiz hesap oluşturun ve oyun dünyasının bir parçası olun.',
      formType: 'kayıt',
      formDescription: 'Yeni hesap oluşturma formu'
    },
    en: {
      title: 'Register - PlayForGG',
      description: 'Join the PlayForGG community! Create a free account and become part of the gaming world.',
      formType: 'register',
      formDescription: 'New account creation form'
    }
  };

  const t = translations[locale as keyof typeof translations] || translations.tr;

  return generateFormMetadata({
    title: t.title,
    description: t.description,
    formType: t.formType,
    formDescription: t.formDescription,
    locale,
    url: `/${locale}/register`,
  });
}

const page = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-black">Kayıt Ol</h2>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Kullanıcı Adı"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="email"
            placeholder="E-posta"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            placeholder="Şifre"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <input
            type="password"
            placeholder="Şifre Tekrar"
            required
            className="w-full border border-gray-300 p-2 rounded"
          />
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 rounded"
          >
            Kayıt Ol
          </button>
        </form>
        <p className="text-center mt-4 text-sm text-black">
          Zaten hesabın var mı?{' '}
          <a href="/login" className="text-orange-500 hover:underline">
            Giriş Yap
          </a>
        </p>
      </div>
    </div>
  );
};

export default page;