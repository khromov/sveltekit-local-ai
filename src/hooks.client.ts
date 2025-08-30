import type { ClientInit } from '@sveltejs/kit';
import { applySafariReadableStreamPolyfill } from '$lib/polyfills/readable-stream-safari';

/**
 * Client-side initialization hook
 *
 * This runs once when the app starts in the browser, before any components
 * are hydrated. It's the perfect place to apply polyfills that need to be
 * available before libraries like phonemizer are used.
 */
export const init: ClientInit = async () => {
	// Apply Safari-specific polyfills
	applySafariReadableStreamPolyfill();
};
