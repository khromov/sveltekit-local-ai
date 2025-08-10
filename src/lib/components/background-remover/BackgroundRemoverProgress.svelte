<script lang="ts">
	import ProgressBar from '../ProgressBar.svelte';

	interface Props {
		progress: number;
		previousProgress?: number;
		message?: string;
	}

	let { progress = 0, previousProgress = 0, message = 'Processing...' }: Props = $props();
</script>

<div class="processing">
	<div class="processing-decoration"></div>
	<h3>
		<span class="title-icon">🔄</span>
		Processing Image
	</h3>
	<p class="progress-percentage">{progress}% Complete</p>

	<div class="progress-wrapper">
		<ProgressBar {progress} {previousProgress} />
	</div>

	<div class="processing-message">
		<span class="pulse-icon">✨</span>
		{message}
	</div>
</div>

<style>
	.processing {
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 2.5rem;
		background: #fff;
		border: 4px solid #000;
		box-shadow: 10px 10px 0 #000;
		margin: 1.5rem 0;
		animation: wobbleIn 0.5s ease-out;
		position: relative;
		transform: rotate(-1deg);
	}

	@keyframes wobbleIn {
		from {
			transform: scale(0.9) rotate(-3deg);
			opacity: 0;
		}
		to {
			transform: scale(1) rotate(-1deg);
			opacity: 1;
		}
	}

	.processing-decoration {
		position: absolute;
		top: -10px;
		left: -10px;
		width: 100px;
		height: 100px;
		background: repeating-linear-gradient(
			45deg,
			#98fb98,
			#98fb98 10px,
			transparent 10px,
			transparent 20px
		);
		border: 3px solid #000;
		border-radius: 50%;
		opacity: 0.3;
		animation: spin 10s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.processing h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 2.5rem;
		color: #000;
		letter-spacing: 3px;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		background: #ffd93d;
		padding: 0.5rem 2rem;
		border: 3px solid #000;
		box-shadow: 6px 6px 0 #000;
		transform: rotate(-2deg);
		text-transform: uppercase;
	}

	.title-icon {
		font-size: 2rem;
		animation: rotate 2s linear infinite;
	}

	@keyframes rotate {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.progress-percentage {
		font-size: 1.5rem;
		font-weight: 700;
		color: #000;
		margin-bottom: 1.5rem;
		background: #98fb98;
		padding: 0.5rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		transform: rotate(1deg);
		animation: pulse 2s ease-in-out infinite;
		text-transform: uppercase;
	}

	@keyframes pulse {
		0%,
		100% {
			transform: scale(1) rotate(1deg);
		}
		50% {
			transform: scale(1.05) rotate(1deg);
		}
	}

	.progress-wrapper {
		width: 100%;
		max-width: 400px;
		margin-bottom: 1.5rem;
	}

	.processing-message {
		margin: 1rem 0;
		color: #000;
		font-weight: 700;
		text-align: center;
		background: #ffd93d;
		padding: 1rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		text-transform: uppercase;
		letter-spacing: 1px;
		display: flex;
		align-items: center;
		gap: 0.75rem;
		transform: rotate(-0.5deg);
	}

	.pulse-icon {
		font-size: 1.5rem;
		animation: flash 1s ease-in-out infinite;
	}

	@keyframes flash {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	@media (max-width: 600px) {
		.processing {
			padding: 1.75rem;
		}

		.processing h3 {
			font-size: 2rem;
		}

		.processing-message {
			font-size: 0.875rem;
			padding: 0.875rem 1rem;
		}
	}
</style>
