<script lang="ts">
	import ProgressBar from './ProgressBar.svelte';

	interface Props {
		title: string;
		progress: number;
		previousProgress?: number;
		message?: string;
		percentageText?: string;
		showPercentage?: boolean;
		mode?: 'progress' | 'spinner';
		topMargin?: boolean;
	}

	let {
		title,
		progress = 0,
		previousProgress = 0,
		message,
		percentageText,
		showPercentage = true,
		mode = 'progress',
		topMargin = false
	}: Props = $props();

	let displayPercentage = $derived(percentageText || `${progress}% Complete`);
</script>

<div class="loading-progress" class:top-margin={topMargin}>
	<h3>{title}</h3>
	{#if mode === 'progress'}
		{#if showPercentage}
			<p class="download-percentage">{displayPercentage}</p>
		{/if}
		<ProgressBar {progress} {previousProgress} />
	{:else}
		<div class="spinner-progress">
			<div class="animated-progress-bar">
				<div class="animated-progress-fill"></div>
			</div>
		</div>
	{/if}
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

	.loading-progress.top-margin {
		margin-top: 2rem;
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

	.spinner-progress {
		width: 100%;
		margin: 0.5rem 0;
	}

	.animated-progress-bar {
		height: 1.25rem;
		background: var(--color-background-tertiary);
		border: var(--border-brutalist-thin);
		border-radius: 6px;
		overflow: hidden;
		width: 100%;
		position: relative;
	}

	.animated-progress-fill {
		height: 100%;
		width: 100%;
		background: linear-gradient(
			90deg,
			var(--color-primary) 0%,
			var(--color-primary) 40%,
			var(--color-warning) 60%,
			var(--color-primary) 100%
		);
		background-size: 300% 100%;
		animation: gradientShift 3s ease-in-out infinite;
		position: relative;
	}

	.animated-progress-fill::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			transparent 30%,
			rgba(255, 255, 255, 0.2) 50%,
			transparent 70%,
			transparent 100%
		);
		animation: shimmer 3s ease-in-out infinite;
	}

	@keyframes gradientShift {
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

	@keyframes shimmer {
		0% {
			transform: translateX(-150%);
		}
		100% {
			transform: translateX(150%);
		}
	}
</style>
