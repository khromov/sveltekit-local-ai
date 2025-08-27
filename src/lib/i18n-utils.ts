import { locales } from 'virtual:wuchale/locales';

/**
 * Extract the current language from a URL pathname
 * @param pathname - The URL pathname (e.g., '/es/chat' or '/chat')
 * @returns The current language code or 'en' as default
 */
export function getCurrentLanguage(pathname: string): string {
	const pathSegments = pathname.split('/').filter(Boolean);
	const firstSegment = pathSegments[0];
	return locales.includes(firstSegment) ? firstSegment : 'en';
}

/**
 * Create a localized link by prepending the language code
 * @param path - The base path (e.g., '/chat')
 * @param lang - The language code (e.g., 'es')
 * @returns The localized path (e.g., '/es/chat' or '/chat' for English)
 */
export function createLocalizedLink(path: string, lang: string): string {
	if (lang === 'en') {
		return path; // English uses clean URLs without prefix
	}
	// Handle root path specially to avoid double slash
	if (path === '/') {
		return `/${lang}`;
	}
	return `/${lang}${path}`;
}

/**
 * Get the current language from a page store (for use in components)
 * @param page - The page store object from $app/stores
 * @returns The current language code
 */
export function getCurrentLanguageFromPage(page: { url: { pathname: string } }): string {
	return getCurrentLanguage(page.url.pathname);
}

/**
 * Export the available locales from Wuchale for use in other components
 */
export { locales };
