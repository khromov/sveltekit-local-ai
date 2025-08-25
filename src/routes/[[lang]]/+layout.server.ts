import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load = (async ({ params }) => {
	console.log('params', params);
	return {};
}) satisfies LayoutServerLoad;
