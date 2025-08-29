// @ts-check
import { adapter as svelte } from '@wuchale/svelte';
import { defineConfig } from 'wuchale';

export default defineConfig({
	// sourceLocale is en by default
	otherLocales: ['es', 'ja', 'sv', 'uk'],
	adapters: {
		main: svelte({
			files: [
				'src/**/*.svelte',
				'src/**/*.svelte.{js,ts}',
				'src/**/+page.{js,ts}',
				'src/**/+layout.{js,ts}',
				'+page.server.{js,ts}',
				'+layout.server.{js,ts}'
			]
		})
	}
});
