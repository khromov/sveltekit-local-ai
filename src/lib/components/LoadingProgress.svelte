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
	<!-- Nature-inspired loading animation -->
	<svg class="loading-decoration" width="80" height="80" viewBox="0 0 80 80">
		<g opacity="0.3">
			<!-- Growing plant animation -->
			<path
				class="stem"
				d="M40,60 L40,{60 - progress * 0.4}"
				stroke="currentColor"
				stroke-width="2"
				stroke-linecap="round"
			/>
			{#if progress > 25}
				<path
					class="leaf-left"
					d="M40,50 Q30,45 30,40 Q35,40 40,45"
					fill="currentColor"
					opacity="0.5"
				/>
			{/if}
			{#if progress > 50}
				<path
					class="leaf-right"
					d="M40,40 Q50,35 50,30 Q45,30 40,35"
					fill="currentColor"
					opacity="0.5"
				/>
			{/if}
			{#if progress > 75}
				<circle
					class="flower"
					cx="40"
					cy={60 - progress * 0.4}
					r="8"
					fill="var(--leaf-gold)"
					opacity="0.6"
				/>
			{/if}
		</g>
	</svg>

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
		background: linear-gradient(
			135deg,
			rgba(255, 255, 255, 0.95) 0%,
			rgba(250, 248, 243, 0.98) 100%
		);
		border: 1px solid rgba(139, 111, 71, 0.2);
		box-shadow:
			0 8px 32px rgba(46, 90, 61, 0.1),
			0 2px 8px rgba(139, 111, 71, 0.08);
		width: 100%;
		max-width: 500px;
		text-align: center;
		border-radius: 20px;
		margin: 0 auto;
		box-sizing: border-box;
		backdrop-filter: blur(10px);
		position: relative;
		overflow: hidden;
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

	.loading-decoration {
		color: var(--forest-primary);
		margin-bottom: 0.5rem;
		animation: gentle-sway 3s ease-in-out infinite;
	}

	@keyframes gentle-sway {
		0%,
		100% {
			transform: translateX(0) rotate(0deg);
		}
		50% {
			transform: translateX(3px) rotate(1deg);
		}
	}

	.loading-progress h3 {
		font-size: 1.5rem;
		font-weight: 600;
		margin: 0;
		color: var(--forest-primary);
		letter-spacing: -0.01em;
	}

	.download-percentage {
		font-size: 1.125rem;
		font-weight: 500;
		color: var(--forest-light);
		margin: 0;
		background: linear-gradient(
			135deg,
			rgba(136, 179, 120, 0.15) 0%,
			rgba(168, 185, 159, 0.1) 100%
		);
		padding: 0.5rem 1.25rem;
		border: 1px solid rgba(46, 90, 61, 0.2);
		border-radius: 8px;
		letter-spacing: 0.02em;
	}

	.loading-message {
		font-size: 0.9375rem;
		font-weight: 400;
		color: var(--text-secondary);
		margin: 0;
		max-width: 100%;
		padding: 0 1rem;
		word-wrap: break-word;
		line-height: 1.5;
		letter-spacing: 0.01em;
	}

	@media (max-width: 600px) {
		.loading-progress {
			padding: 1.5rem 1rem;
			max-width: none;
		}

		.loading-progress h3 {
			font-size: 1.25rem;
		}

		.download-percentage {
			font-size: 1rem;
			padding: 0.375rem 1rem;
		}

		.loading-message {
			font-size: 0.875rem;
			padding: 0 0.5rem;
		}

		.loading-decoration {
			width: 60px;
			height: 60px;
		}
	}
</style>
