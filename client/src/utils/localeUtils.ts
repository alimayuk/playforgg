export type SupportedLocales = "tr" | "en";

let cookiesModule: typeof import("next/headers") | null = null;
export const getServerLocale = (): SupportedLocales => {
  try {
    if (!cookiesModule && typeof require !== "undefined") {
      cookiesModule = require("next/headers");
    }
    const locale = cookiesModule?.cookies().get("NEXT_LOCALE")?.value || "tr";
    return locale === "en" ? "en" : "tr";
  } catch (error) {
    console.error("Server locale read error:", error);
    return "tr";
  }
};

let clientLocaleCache: SupportedLocales | null = null;
export const getClientLocale = (): SupportedLocales => {
  if (clientLocaleCache) return clientLocaleCache;
  
  try {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/);
    clientLocaleCache = match?.[1] === "en" ? "en" : "tr";
    return clientLocaleCache;
  } catch (error) {
    console.error("Client locale read error:", error);
    return "tr";
  }
};

declare global {
  var __next_locale: SupportedLocales | undefined;
}
export const getLocale = (): SupportedLocales => {
  if (typeof __next_locale !== "undefined") {
    return __next_locale;
  }
  
  const locale = typeof window === "undefined" 
    ? getServerLocale() 
    : getClientLocale();
  
  if (typeof window !== "undefined") {
    globalThis.__next_locale = locale;
  }
  
  return locale;
};