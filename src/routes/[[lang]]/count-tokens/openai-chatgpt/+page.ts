import { browser, building } from '$app/environment';
import { Tiktoken } from 'js-tiktoken';
import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
	if (building || !browser) {
		return {
			encoder: null
		};
	} else {
		console.log('Loading encoder in browser');
		const res = await fetch(`/o200k_base.json`);
		const o200k_base = await res.json();
		const specialTokens = Object.keys(o200k_base?.special_tokens ?? {});
		return {
			encoder: new Tiktoken(o200k_base),
			specialTokens
		};
	}
}) satisfies PageLoad;
