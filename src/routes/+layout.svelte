<script lang="ts">
	import '$lib/design-system.css';
	import { page } from '$app/state';
	import '@fontsource/space-grotesk/400.css';
	import '@fontsource/space-grotesk/500.css';
	import '@fontsource/space-grotesk/700.css';
	import '@fontsource/bebas-neue';
	import { Toaster } from 'svelte-sonner';
	import Tracking from '$lib/components/common/Tracking.svelte';
	import Navigation from '$lib/components/common/Navigation.svelte';
	import { getCurrentLanguage, createLocalizedLink } from '$lib/i18n-utils';
	import HomeIcon from 'virtual:icons/lucide/home';
	import SettingsIcon from 'virtual:icons/lucide/settings';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	// Get current language from URL
	const currentLang = $derived(getCurrentLanguage(page.url.pathname));

	const DEFAULT_TITLE = 'Local AI tools';

	const getLocalizedNavLinks = (currentLang: string) => {
		return [
			{ path: createLocalizedLink('/', currentLang), label: '', Icon: HomeIcon },
			{ path: createLocalizedLink('/settings', currentLang), label: 'Settings', Icon: SettingsIcon }
		];
	};
</script>

<svelte:head>
	<title>{page.data.seo?.title || DEFAULT_TITLE}</title>
	<meta name="description" content={page.data.seo?.description || ''} />

	<!-- Open Graph meta tags -->
	<meta property="og:title" content={page.data.seo?.title || DEFAULT_TITLE} />
	<meta property="og:description" content={page.data.seo?.description || ''} />
	<meta property="og:image" content={page.data.seo?.ogImage || ''} />
	<meta property="og:url" content={page.data.seo?.url} />
	<meta property="og:type" content="website" />
	<meta property="og:site_name" content={DEFAULT_TITLE} />

	<!-- Twitter Card meta tags -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={page.data.seo?.title || DEFAULT_TITLE} />
	<meta name="twitter:description" content={page.data.seo?.description || ''} />
	<meta name="twitter:image" content={page.data.seo?.ogImage || ''} />
</svelte:head>

<div class="app-wrapper">
	<div class="container">
		<Navigation {currentLang} navLinks={getLocalizedNavLinks(currentLang)} {page} />

		<div class="content-wrapper">
			{@render children?.()}
		</div>
	</div>
</div>

<Toaster
	position="bottom-right"
	theme="light"
	richColors
	toastOptions={{
		style:
			'border: 3px solid #000; box-shadow: 4px 4px 0 #000; border-radius: 8px; font-family: Space Grotesk, sans-serif; font-weight: 600;'
	}}
/>

<Tracking />

<style>
	/* Base styles with refined Neo-Brutalist approach */
	:global(html) {
		height: 100%;
	}

	:global(body) {
		margin: 0;
		padding: 0;
		font-family: var(--font-family-primary);
		font-size: 16px;
		line-height: 1.5;
		background: linear-gradient(
			135deg,
			var(--color-gradient-gold) 0%,
			var(--color-gradient-lavender) 50%,
			var(--color-gradient-mint) 100%
		);
		background-size: 200% 200%;
		background-attachment: fixed;
		animation: gradient-shift 20s ease infinite;
		color: var(--color-text-primary);
		position: relative;
		overflow-x: hidden;
		min-height: 100vh;
	}

	:global(body)::before {
		content: '';
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image: repeating-linear-gradient(
			0deg,
			transparent,
			transparent 40px,
			rgba(0, 0, 0, 0.02) 40px,
			rgba(0, 0, 0, 0.02) 41px
		);
		pointer-events: none;
		z-index: 1;
	}

	@keyframes gradient-shift {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}

	.app-wrapper {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
		position: relative;
		z-index: 2;
	}

	.container {
		width: 100%;
		max-width: 900px;
		margin: 0 auto;
		padding: 1rem;
		box-sizing: border-box;
		flex: 1;
		display: flex;
		flex-direction: column;
	}

	.content-wrapper {
		width: 100%;
		position: relative;
		flex: 1;
		display: flex;
		flex-direction: column;
		min-height: 0; /* Critical for nested flex scrolling */
	}

	/* Shared component styling - Refined Neo-Brutalist */
	:global(.card-interface) {
		border: var(--border-brutalist-thick);
		background: var(--color-background-main);
		box-shadow: var(--shadow-brutalist-large);
		width: 100%;
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-sizing: border-box;
		border-bottom-right-radius: 16px;
		display: flex;
		flex-direction: column;
	}

	:global(.toolbar) {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1rem 1.25rem;
		background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-warning) 100%);
		border-bottom: var(--border-brutalist-thick);
		flex-wrap: wrap;
		gap: 0.5rem;
		flex: 0 0 auto; /* Don't grow/shrink */
	}

	:global(.model-info) {
		font-size: 0.875rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		word-break: break-word;
		max-width: 100%;
	}

	:global(.content-area) {
		padding: 1.5rem;
		background: var(--color-background-main);
		display: flex;
		flex-direction: column;
		gap: 1rem;
		box-sizing: border-box;
	}

	:global(.input-area) {
		padding: 1rem 1.25rem;
		border-top: var(--border-brutalist-thick);
		background: var(--color-background-secondary);
		box-sizing: border-box;
		flex: 0 0 auto; /* Don't grow/shrink */
	}

	:global(.disclaimer) {
		margin-top: 0.5rem;
		font-size: 0.8125rem;
		font-weight: 500;
		color: var(--color-text-tertiary);
		text-align: center;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	:global(.primary-button) {
		padding: 0.875rem 1.75rem;
		background: var(--color-primary);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-sizing: border-box;
	}

	:global(.primary-button:hover) {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	:global(.primary-button:active) {
		transform: translate(0);
		box-shadow: var(--shadow-brutalist-small);
	}

	:global(.primary-button:disabled) {
		background: var(--color-background-disabled);
		color: var(--color-text-disabled);
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.container {
			padding: 0.75rem;
		}

		:global(.toolbar) {
			padding: 0.875rem 1rem;
		}

		:global(.model-info) {
			font-size: 0.75rem;
		}

		:global(.content-area) {
			padding: 1rem;
		}

		:global(.input-area) {
			padding: 0.875rem 1rem;
		}
	}

	@media (max-width: 400px) {
		.container {
			padding: 0.5rem;
		}
	}
</style>
