// @ts-check
import { adapter as svelte } from '@wuchale/svelte';
import { adapter as vanilla } from 'wuchale/adapter-vanilla';
import { defineConfig } from 'wuchale';

export default defineConfig({
	// sourceLocale is en by default
	otherLocales: ['es', 'ja', 'sv', 'uk'],
	adapters: {
		main: svelte({
			files: ['src/**/*.svelte', 'src/**/*.svelte.{js,ts}']
		}),
		server: vanilla({
			files: [
				'src/**/*.server.{js,ts}',
				'src/**/+page.{js,ts}',
				'src/**/+layout.{js,ts}',
				'src/**/+page.server.{js,ts}',
				'src/**/+layout.server.{js,ts}'
			],
			writeFiles: {
				compiled: true,
				proxy: true
			}
		})
	}
});
