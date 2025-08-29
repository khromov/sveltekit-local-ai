import * as main from './locales/loader.ssr.svelte.js';
import * as js from './locales/loader.ssr.js';
import { runWithLocale, loadLocales } from 'wuchale/load-utils/server';
import { locales } from 'virtual:wuchale/locales';

await loadLocales(main.key, main.loadIDs, main.loadCatalog, locales);
await loadLocales(js.key, js.loadIDs, js.loadCatalog, locales);

export const handle = async ({ event, resolve }) => {
	const localeToLoad =
		event.params.lang && locales.includes(event.params.lang) ? event.params.lang : 'en';
	return await runWithLocale(localeToLoad, () => resolve(event));
};
