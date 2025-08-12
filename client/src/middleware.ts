import createIntlMiddleware from 'next-intl/middleware';
import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale } from './i18n/i18n';
import { verifyJwtToken } from './app/lib/jwtToken';

const AUTH_PAGES = ['login', 'register'];
const PROTECTED_PATHS = ['admin'];

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

  // Redirect to default locale if no locale in path
  if (pathname === '/') {
    const localeFromCookie = request.cookies.get('NEXT_LOCALE')?.value;
    const preferredLocale = locales.includes(localeFromCookie ?? '')
      ? localeFromCookie
      : defaultLocale;
    return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
  }

  if (!locale) {
    const localeFromCookie = request.cookies.get('NEXT_LOCALE')?.value;
    const preferredLocale = locales.includes(localeFromCookie ?? '')
      ? localeFromCookie
      : defaultLocale;
    return NextResponse.redirect(new URL(`/${preferredLocale}${pathname}`, request.url));
  }

  const pathWithoutLocale = pathname.slice(locale.length + 1) || '/';
  const token = request.cookies.get('c')?.value ?? null;
  const hasVerifiedToken = token && (await verifyJwtToken(token));

  const isAuthPage = AUTH_PAGES.some((page) =>
    pathWithoutLocale === `/${page}` || pathWithoutLocale === page
  );

  const isProtectedPath = PROTECTED_PATHS.some((path) =>
    pathWithoutLocale.startsWith(`/${path}`)
  );

  // Handle invalid token cases
  // middleware.ts
  if (token && !hasVerifiedToken) {
    if (isProtectedPath) {
      const response = NextResponse.redirect(
        new URL(`/${locale}/login?next=${encodeURIComponent(pathname)}`, request.url)
      );
      response.cookies.delete('c');
      response.cookies.delete('token');
      return response;
    } else {
      const response = NextResponse.next();
      response.cookies.delete('c');
      response.cookies.delete('token');
      // Client tarafında state'in temizlendiğini anlaması için bir header ekleyelim
      response.headers.set('x-clear-auth', 'true');
      return response;
    }
  }

  // Auth pages handling
  if (isAuthPage) {
    if (hasVerifiedToken) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    return NextResponse.next();
  }

  // Protected paths handling
  if (isProtectedPath && !hasVerifiedToken) {
    return NextResponse.redirect(
      new URL(`/${locale}/login?next=${encodeURIComponent(pathname)}`, request.url)
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/((?!_next|favicon.ico|images|assets|api|.*\\..*).*)',
  ],
};
