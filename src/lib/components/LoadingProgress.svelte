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
	<div class="loading-decoration">
		<svg viewBox="0 0 80 80" width="80" height="80">
			<circle
				cx="40"
				cy="40"
				r="25"
				fill="none"
				stroke="var(--sage)"
				stroke-width="2"
				opacity="0.3"
			/>
			<circle
				cx="40"
				cy="40"
				r="15"
				fill="none"
				stroke="var(--clay)"
				stroke-width="1"
				opacity="0.4"
			/>
			<circle cx="40" cy="40" r="3" fill="var(--mocha-mousse)" opacity="0.6">
				<animate attributeName="r" values="3;5;3" dur="2s" repeatCount="indefinite" />
			</circle>
		</svg>
	</div>
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
		background: rgba(245, 241, 235, 0.9);
		backdrop-filter: blur(15px);
		border: 1px solid var(--earth-medium);
		box-shadow:
			0 8px 32px rgba(139, 111, 71, 0.15),
			inset 0 1px 0 rgba(255, 255, 255, 0.8);
		width: calc(100% - 4rem);
		max-width: 500px;
		text-align: center;
		border-radius: 1.5rem;
		margin: 0 auto;
		box-sizing: border-box;
		position: relative;
		animation: fadeInUp 0.6s ease-out;
	}

	@keyframes fadeInUp {
		from {
			opacity: 0;
			transform: translateY(30px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.loading-decoration {
		animation: gentleRotate 8s linear infinite;
		margin-bottom: 0.5rem;
	}

	@keyframes gentleRotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.loading-progress h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: var(--text-primary);
		letter-spacing: 0.02em;
	}

	.download-percentage {
		font-size: 1.1rem;
		font-weight: 500;
		color: var(--text-secondary);
		margin: 0;
		background: linear-gradient(135deg, rgba(167, 132, 106, 0.1) 0%, rgba(156, 175, 136, 0.1) 100%);
		padding: 0.5rem 1.25rem;
		border: 1px solid var(--earth-medium);
		border-radius: 1.5rem;
		letter-spacing: 0.02em;
		backdrop-filter: blur(5px);
		box-shadow:
			inset 0 1px 3px rgba(139, 111, 71, 0.05),
			0 2px 8px rgba(139, 111, 71, 0.1);
	}

	.loading-message {
		font-size: 0.95rem;
		font-weight: 400;
		color: var(--text-light);
		margin: 0;
		max-width: 100%;
		padding: 0 1rem;
		word-wrap: break-word;
		line-height: 1.5;
		letter-spacing: 0.01em;
		font-style: italic;
	}

	@media (max-width: 600px) {
		.loading-progress {
			width: calc(100% - 2rem);
			padding: 2rem 1.5rem;
			max-width: none;
			margin: 0 1rem;
		}

		.loading-progress h3 {
			font-size: 1.35rem;
		}

		.download-percentage {
			font-size: 1rem;
			padding: 0.4rem 1rem;
		}

		.loading-message {
			font-size: 0.9rem;
			padding: 0 0.5rem;
		}
	}

	@media (max-width: 400px) {
		.loading-progress {
			width: calc(100% - 1rem);
			margin: 0 0.5rem;
			padding: 1.75rem 1.25rem;
		}

		.loading-progress h3 {
			font-size: 1.25rem;
		}

		.download-percentage {
			font-size: 0.95rem;
		}
	}
</style>
