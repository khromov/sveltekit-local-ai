// @ts-check
import { adapter as svelte } from '@wuchale/svelte';
import { defineConfig } from 'wuchale';

export default defineConfig({
	// sourceLocale is en by default
	otherLocales: ['sv'],
	adapters: {
		main: svelte()
	}
});
