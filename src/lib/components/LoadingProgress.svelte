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
		padding: 2.5rem;
		background-color: white;
		border-radius: 20px;
		box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
		width: 100%;
		text-align: center;
	}

	.loading-progress h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: #111;
	}

	.download-percentage {
		font-size: 1.125rem;
		font-weight: 500;
		color: #0071e3;
		margin: 0;
	}

	.loading-message {
		font-size: 0.9375rem;
		color: #666;
		margin: 0;
		max-width: 320px;
	}

	@media (max-width: 600px) {
		.loading-progress {
			padding: 1.75rem;
		}
	}
</style>
