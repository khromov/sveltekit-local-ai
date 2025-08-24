import { loadCatalog, loadIDs, key } from './locales/loader.svelte.js';
import { runWithLocale, loadLocales } from 'wuchale/load-utils/server';
import { locales } from 'virtual:wuchale/locales';

// load at server startup
await loadLocales(key, loadIDs, loadCatalog, locales);

/** @type {import('@sveltejs/kit').Handle} */
export const handle = async ({ event, resolve }) => {
	const locale = event.url.searchParams.get('locale') ?? 'en';
	return await runWithLocale(locale, () => resolve(event));
};
