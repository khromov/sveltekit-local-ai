import { dev } from '$app/environment';
import type { LayoutLoad } from './$types';
import { locales } from 'virtual:wuchale/locales';
import { browser } from '$app/environment';
import { loadLocale } from 'wuchale/load-utils';
// so that the loaders are registered
import '../locales/loader.svelte.js';

export const ssr = true;
export const prerender = true;

export const load: LayoutLoad = async ({ url }) => {
	const locale = url.searchParams.get('locale') ?? 'en';
	if (!locales.includes(locale)) {
		return;
	}
	if (browser) {
		await loadLocale(locale);
	}

	const baseUrl = dev ? '' : 'https://ai.stanislav.garden';
	const ogImageUrl = `${baseUrl}/og.png`;
	const currentUrl = `${baseUrl}${url.pathname}`;

	return {
		seo: {
			title: 'Local AI Tools',
			description: 'Private AI tools that run in your browser',
			ogImage: ogImageUrl,
			url: currentUrl
		}
	};
};
