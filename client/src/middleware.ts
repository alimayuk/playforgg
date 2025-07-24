import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/i18n';
import { verifyJwtToken } from './app/lib/jwtToken';

const AUTH_PAGES = ['login', 'register'];
const PROTECTED_PATHS = ['admin']; // gerçek korumalı path'leri buraya ekle

const intlMiddleware = createIntlMiddleware({
  defaultLocale,
  locales,
  localePrefix: 'always',
});

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const pathname = url.pathname;

  const locale = locales.find(
    (loc) => pathname === `/${loc}` || pathname.startsWith(`/${loc}/`)
  );

  // ✅ Eğer root path ise (/) → Cookie varsa ona göre yönlendir
  if (pathname === '/') {
    const localeFromCookie: string | undefined = request.cookies.get('NEXT_LOCALE')?.value;
    const preferredLocale = locales.includes(localeFromCookie ?? '')
      ? localeFromCookie
      : defaultLocale;

    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
  }

  // ✅ Eğer path'te locale yoksa → ekle
  if (!locale) {
    const localeFromCookie = request.cookies.get('NEXT_LOCALE')?.value;
    const preferredLocale = locales.includes(localeFromCookie ?? '')
      ? localeFromCookie
      : defaultLocale;

    return NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url));
  }

  // ✅ Auth ve koruma kontrolleri
  const pathWithoutLocale = pathname.slice(locale.length + 1) || '/';
  const token = request.cookies.get('token')?.value ?? null;
  const hasVerifiedToken = token && (await verifyJwtToken(token));

  const isAuthPage = AUTH_PAGES.some((page) =>
    pathWithoutLocale === `/${page}` || pathWithoutLocale === page
  );

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathWithoutLocale.startsWith(`/${path}`)
  );

  if (isAuthPage) {
    if (!hasVerifiedToken) {
      const response = NextResponse.next();
      response.cookies.delete('token');
      return response;
    }
    return NextResponse.redirect(new URL(`/${locale}`, request.url));
  }

  if (isProtectedPath && !hasVerifiedToken) {
    const loginUrl = new URL(
      `/${locale}/login?next=${encodeURIComponent(pathname)}`,
      request.url
    );
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete('token');
    return response;
  }

  // ✅ next-intl middleware en sonda
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|images|assets|api|.*\\..*).*)',
  ],
};
