<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	interface Props {
		title: string;
		progress: number;
		previousProgress?: number;
		message?: string;
		percentageText?: string;
		showPercentage?: boolean;
	}

	let {
		title,
		progress = 0,
		previousProgress = 0,
		message,
		percentageText,
		showPercentage = true
	}: Props = $props();

	let displayPercentage = $derived(percentageText || `${progress}% Complete`);
</script>

<div class="loading-progress">
	<h3>{title}</h3>
	{#if showPercentage}
		<p class="download-percentage">{displayPercentage}</p>
	{/if}
	<ProgressBar {progress} {previousProgress} />
	{#if message}
		<p class="loading-message">{message}</p>
	{/if}
</div>

<style>
	.loading-progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.25rem;
		padding: 2rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-thick);
		box-shadow: 5px 5px 0 var(--color-border-primary);
		width: calc(100% - 4rem);
		max-width: 500px;
		text-align: center;
		border-radius: 12px;
		margin: 0 auto;
		box-sizing: border-box;
	}

	.loading-progress h3 {
		font-size: 1.75rem;
		font-weight: 700;
		margin: 0;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
	}

	.download-percentage {
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--color-text-primary);
		margin: 0;
		background: var(--color-gradient-gold);
		padding: 0.375rem 1rem;
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		text-transform: uppercase;
	}

	.loading-message {
		font-size: 0.9375rem;
		font-weight: 500;
		color: var(--color-text-tertiary);
		margin: 0;
		max-width: 100%;
		padding: 0 1rem;
		word-wrap: break-word;
	}

	@media (max-width: 600px) {
		.loading-progress {
			width: calc(100% - 2rem);
			padding: 1.5rem 1rem;
			max-width: none;
			margin: 0 1rem;
		}

		.loading-progress h3 {
			font-size: 1.5rem;
		}

		.download-percentage {
			font-size: 1.125rem;
			padding: 0.25rem 0.75rem;
		}

		.loading-message {
			font-size: 0.875rem;
			padding: 0 0.5rem;
		}
	}

	@media (max-width: 400px) {
		.loading-progress {
			width: calc(100% - 1rem);
			margin: 0 0.5rem;
			padding: 1.25rem 0.75rem;
		}

		.loading-progress h3 {
			font-size: 1.25rem;
		}

		.download-percentage {
			font-size: 1rem;
		}
	}
</style>
