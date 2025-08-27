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
		const res = await fetch(`/claude.json`);
		const claudeEncoding = await res.json();
		const specialTokens = Object.keys(claudeEncoding?.special_tokens ?? {});
		return {
			encoder: new Tiktoken(claudeEncoding),
			specialTokens
		};
	}
}) satisfies PageLoad;
