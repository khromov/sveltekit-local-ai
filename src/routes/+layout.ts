import { dev } from '$app/environment';
import type { LayoutLoad } from './$types';

export const ssr = true;
export const prerender = true;

export const load: LayoutLoad = ({ url }) => {
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
