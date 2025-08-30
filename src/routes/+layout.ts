import { dev } from '$app/environment';
import type { LayoutLoad } from './$types';
import { locales } from 'virtual:wuchale/locales';
import { browser } from '$app/environment';
import { loadLocale } from 'wuchale/load-utils';
import '../locales/loader.svelte.js';

export const ssr = true;
export const prerender = true;

export const load: LayoutLoad = async ({ url, params }) => {
	const defaultLocale = 'en';
	const requestedLocale = params.lang || defaultLocale;
	const currentLocale = locales.includes(requestedLocale) ? requestedLocale : defaultLocale;
	if (browser) {
		await loadLocale(currentLocale);
	}

	const baseUrl = dev ? '' : 'https://enclave.page';
	const ogImageUrl = `${baseUrl}/og.png`;
	const currentUrl = `${baseUrl}${url.pathname}`;

	return {
		seo: {
			title: 'Enclave',
			description: 'Private AI tools that run in your browser',
			ogImage: ogImageUrl,
			url: currentUrl
		}
	};
};
