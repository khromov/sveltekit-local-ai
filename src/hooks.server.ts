import { loadCatalog, loadIDs, key } from './locales/loader.svelte.js';
import { runWithLocale, loadLocales } from 'wuchale/load-utils/server';
// import { locales } from 'virtual:wuchale/locales';

// Load only the english one in SSR
await loadLocales(key, loadIDs, loadCatalog, ['en']);

export const handle = async ({ event, resolve }) => {
	const defaultLocale = 'en';
	return await runWithLocale(defaultLocale, () => resolve(event));
};
