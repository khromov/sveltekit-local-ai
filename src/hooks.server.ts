import { loadCatalog, loadIDs, key } from './locales/loader.svelte.js';
import { runWithLocale, loadLocales } from 'wuchale/load-utils/server';
import { locales } from 'virtual:wuchale/locales';

await loadLocales(key, loadIDs, loadCatalog, locales);

export const handle = async ({ event, resolve }) => {
	const localeToLoad =
		event.params.lang && locales.includes(event.params.lang) ? event.params.lang : 'en';
	return await runWithLocale(localeToLoad, () => resolve(event));
};
