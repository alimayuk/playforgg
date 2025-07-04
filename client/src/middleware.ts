import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import {locales, defaultLocale} from './i18n/i18n';

export default createMiddleware({
  defaultLocale,
  locales,
  localePrefix: 'as-needed',
});

export const config = {
  matcher: ['/((?!_next|favicon.ico|images|assets|api).*)'],
};
