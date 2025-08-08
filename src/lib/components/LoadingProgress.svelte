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
	<div class="progress-decoration"></div>
	<h3>{title}</h3>
	{#if showPercentage}
		<p class="download-percentage">{displayPercentage}</p>
	{/if}
	<ProgressBar {progress} {previousProgress} />
	{#if message}
		<p class="loading-message">{message}</p>
	{/if}
	<div class="loading-icons">
		<span class="icon">⚡</span>
		<span class="icon">💾</span>
		<span class="icon">🚀</span>
	</div>
</div>

<style>
	.loading-progress {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1.5rem;
		padding: 2.5rem;
		background: #FFF;
		border: 4px solid #000;
		box-shadow: 10px 10px 0 #000;
		width: 100%;
		text-align: center;
		position: relative;
		transform: rotate(-1deg);
		animation: wobble 3s ease-in-out infinite;
	}

	@keyframes wobble {
		0%, 100% { transform: rotate(-1deg); }
		25% { transform: rotate(-1.5deg); }
		50% { transform: rotate(1deg); }
		75% { transform: rotate(1.5deg); }
	}

	.progress-decoration {
		position: absolute;
		top: -10px;
		left: -10px;
		right: -10px;
		bottom: -10px;
		background: repeating-linear-gradient(
			45deg,
			#FFD93D,
			#FFD93D 10px,
			transparent 10px,
			transparent 20px
		);
		z-index: -1;
		opacity: 0.2;
		transform: rotate(1deg);
	}

	.loading-progress h3 {
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2.5rem;
		font-weight: 400;
		margin: 0;
		color: #000;
		text-transform: uppercase;
		letter-spacing: 3px;
		background: #FFD93D;
		padding: 0.5rem 2rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		transform: rotate(-2deg);
	}

	.download-percentage {
		font-size: 1.5rem;
		font-weight: 700;
		color: #000;
		margin: 0;
		background: #98FB98;
		padding: 0.5rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		transform: rotate(1deg);
		animation: pulse 2s ease-in-out infinite;
	}

	@keyframes pulse {
		0%, 100% { transform: scale(1) rotate(1deg); }
		50% { transform: scale(1.05) rotate(1deg); }
	}

	.loading-message {
		font-size: 1.0625rem;
		font-weight: 600;
		color: #000;
		margin: 0;
		max-width: 400px;
		padding: 1rem 1.5rem;
		background: #FF69B4;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		border-radius: 20% 5% 20% 5% / 5% 20% 5% 20%;
		transform: rotate(-1deg);
	}

	.loading-icons {
		display: flex;
		gap: 1.5rem;
		margin-top: 1rem;
	}

	.icon {
		font-size: 2rem;
		animation: bounce 1.5s ease-in-out infinite;
		display: inline-block;
	}

	.icon:nth-child(1) {
		animation-delay: 0s;
	}

	.icon:nth-child(2) {
		animation-delay: 0.2s;
	}

	.icon:nth-child(3) {
		animation-delay: 0.4s;
	}

	@keyframes bounce {
		0%, 100% { transform: translateY(0); }
		50% { transform: translateY(-10px); }
	}

	@media (max-width: 600px) {
		.loading-progress {
			padding: 1.75rem;
		}

		.loading-progress h3 {
			font-size: 2rem;
		}

		.download-percentage {
			font-size: 1.25rem;
		}
	}
</style>
