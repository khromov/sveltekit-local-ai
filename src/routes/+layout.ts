import { dev } from '$app/environment';
import type { LayoutLoad } from './$types';
import { locales } from 'virtual:wuchale/locales';
import { browser } from '$app/environment';
import { loadLocale } from 'wuchale/load-utils';
import '../locales/loader.svelte.js';

import { locale } from '$lib/stores';
import { get } from 'svelte/store';

export const ssr = true;
export const prerender = true;

export const load: LayoutLoad = async ({ url }) => {
	const currentLocale = browser ? get(locale) : null;
	if (!locales.includes(currentLocale)) {
		return;
	}
	if (browser) {
		await loadLocale(currentLocale);
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
