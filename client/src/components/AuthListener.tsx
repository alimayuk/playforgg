'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/userStore';

export default function AuthListener() {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearUser } = useUserStore();

  useEffect(() => {
    const checkAuth = () => {
      const hasToken = document.cookie.includes('c=');
      const shouldClearAuth = document.documentElement.hasAttribute('x-clear-auth');

      if (!hasToken || shouldClearAuth) {
        clearUser();
        if (pathname.startsWith('/admin')) {
          router.push('/login');
        }
      }
    };

    // MutationObserver ile DOM değişikliklerini izle
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'x-clear-auth') {
          checkAuth();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['x-clear-auth'],
    });

    // İlk yüklemede kontrol et
    checkAuth();

    // Her route değişikliğinde kontrol et
    const handleRouteChange = () => checkAuth();
    window.addEventListener('routeChangeComplete', handleRouteChange);

    // Pencere focus olduğunda kontrol et
    window.addEventListener('focus', checkAuth);

    return () => {
      observer.disconnect();
      window.removeEventListener('routeChangeComplete', handleRouteChange);
      window.removeEventListener('focus', checkAuth);
    };
  }, [clearUser, pathname, router, user]);

  return null;
}