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
		gap: 1.5rem;
		padding: 2.5rem;
		background: rgba(255, 255, 255, 0.95);
		border: 1px solid rgba(82, 121, 82, 0.2);
		box-shadow: 0 16px 64px rgba(82, 121, 82, 0.15);
		width: calc(100% - 2rem);
		max-width: 500px;
		text-align: center;
		border-radius: 20px;
		margin: 0 auto;
		box-sizing: border-box;
		backdrop-filter: blur(16px);
		position: relative;
	}

	.loading-progress h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: #2e4a2e;
		text-transform: none;
		letter-spacing: 0.01em;
		line-height: 1.3;
	}

	.download-percentage {
		font-size: 1.125rem;
		font-weight: 500;
		color: #527952;
		margin: 0;
		background: rgba(82, 121, 82, 0.1);
		padding: 0.5rem 1.25rem;
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 12px;
		text-transform: none;
		backdrop-filter: blur(8px);
	}

	.loading-message {
		font-size: 0.9rem;
		font-weight: 400;
		color: rgba(82, 121, 82, 0.7);
		margin: 0;
		max-width: 100%;
		padding: 0 1rem;
		word-wrap: break-word;
		line-height: 1.5;
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
