<script lang="ts">
	import { page } from '$app/state';
	import HomeIcon from 'virtual:icons/lucide/home';
	import RefreshCwIcon from 'virtual:icons/lucide/refresh-cw';
	import { getCurrentLanguage, createLocalizedLink } from '$lib/i18n-utils';

	// Get current language from URL and generate localized links
	const currentLang = $derived(getCurrentLanguage(page.url.pathname));
	const homeLink = $derived(createLocalizedLink('/', currentLang));

	// Determine error type for styling
	const is404 = $derived(page.status === 404);
	const errorTitle = $derived(is404 ? 'Page Not Found' : 'Something went wrong');
	const errorDescription = $derived(
		is404
			? 'The page you are looking for does not exist or has been moved.'
			: page.error?.message || 'An unexpected error occurred.'
	);

	// Reload page function
	function reloadPage() {
		window.location.reload();
	}
</script>

<div class="error-container">
	<div class="error-content">
		<div class="error-header">
			<div class="error-status">{page.status}</div>
			<h1 class="error-title">{errorTitle}</h1>
		</div>

		<div class="error-body">
			<p class="error-description">
				{errorDescription}
			</p>

			<div class="error-actions">
				<a href={homeLink} class="action-button home-button">
					<HomeIcon style="width: 20px; height: 20px; stroke-width: 2.5" />
					<span>Go Home</span>
				</a>

				{#if !is404}
					<button onclick={reloadPage} class="action-button retry-button">
						<RefreshCwIcon style="width: 20px; height: 20px; stroke-width: 2.5" />
						<span>Try Again</span>
					</button>
				{/if}
			</div>
		</div>

		<footer class="error-footer">
			<p>All processing happens locally in your browser using WebAssembly.</p>
			<p>No data is sent to external servers.</p>
		</footer>
	</div>
</div>

<style>
	.error-container {
		min-height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 1rem;
		box-sizing: border-box;
		position: relative;
		z-index: 2;
	}

	.error-content {
		width: 100%;
		max-width: 600px;
		text-align: center;
		animation: fadeIn 0.6s ease-out;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.error-header {
		margin-bottom: 2rem;
	}

	.error-status {
		font-size: 6rem;
		font-weight: 800;
		line-height: 1;
		margin-bottom: 1rem;
		background: var(--color-text-primary);
		color: var(--color-primary);
		padding: 1rem 2rem;
		display: inline-block;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		border-radius: 12px;
		text-transform: uppercase;
		letter-spacing: 2px;
	}

	.error-title {
		font-size: 2.5rem;
		font-weight: 700;
		margin: 0;
		color: var(--color-text-primary);
		background: var(--color-background-main);
		display: inline-block;
		padding: 0.75rem 1.5rem;
		border: var(--border-brutalist-thin);
		box-shadow: var(--shadow-brutalist-medium);
		border-radius: 8px;
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.error-body {
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-large);
		border-radius: 12px;
		padding: 2rem;
		margin-bottom: 2rem;
	}

	.error-description {
		font-size: 1.125rem;
		color: var(--color-text-secondary);
		line-height: 1.6;
		margin: 0 0 2rem 0;
	}

	.error-actions {
		display: flex;
		justify-content: center;
		gap: 1rem;
		flex-wrap: wrap;
	}

	.action-button {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		padding: 0.875rem 1.75rem;
		font-size: 1rem;
		font-weight: 700;
		text-decoration: none;
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		cursor: pointer;
		transition: all 0.2s ease;
		box-shadow: var(--shadow-brutalist-medium);
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-sizing: border-box;
	}

	.home-button {
		background: var(--color-primary);
		color: var(--color-text-primary);
	}

	.retry-button {
		background: var(--color-background-main);
		color: var(--color-text-primary);
	}

	.action-button:hover {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.action-button:active {
		transform: translate(0);
		box-shadow: var(--shadow-brutalist-small);
	}

	.error-footer {
		color: var(--color-text-tertiary);
		font-size: 0.9375rem;
		animation: fadeIn 0.6s ease-out;
		animation-delay: 0.3s;
		animation-fill-mode: both;
	}

	.error-footer p {
		margin: 0.5rem 0;
	}

	/* Responsive adjustments */
	@media (max-width: 768px) {
		.error-container {
			padding: 1.5rem 1rem;
		}

		.error-status {
			font-size: 4rem;
			padding: 0.75rem 1.5rem;
		}

		.error-title {
			font-size: 2rem;
			padding: 0.5rem 1rem;
		}

		.error-body {
			padding: 1.5rem;
		}

		.error-description {
			font-size: 1rem;
		}

		.action-button {
			padding: 0.75rem 1.5rem;
			font-size: 0.875rem;
		}
	}

	@media (max-width: 480px) {
		.error-status {
			font-size: 3rem;
			padding: 0.5rem 1rem;
		}

		.error-title {
			font-size: 1.5rem;
			padding: 0.375rem 0.75rem;
		}

		.error-body {
			padding: 1rem;
		}

		.error-actions {
			flex-direction: column;
			align-items: center;
		}

		.action-button {
			width: 100%;
			max-width: 200px;
		}
	}
</style>
