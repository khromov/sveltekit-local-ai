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

	<div class="processing-steps">
		<div class="step" class:active={progress >= 20} class:complete={progress > 20}>
			<span class="step-number">1</span>
			<span class="step-text">Loading Image</span>
		</div>
		<div class="step" class:active={progress >= 40} class:complete={progress > 40}>
			<span class="step-number">2</span>
			<span class="step-text">Preprocessing</span>
		</div>
		<div class="step" class:active={progress >= 70} class:complete={progress > 70}>
			<span class="step-number">3</span>
			<span class="step-text">AI Processing</span>
		</div>
		<div class="step" class:active={progress >= 85} class:complete={progress > 85}>
			<span class="step-number">4</span>
			<span class="step-text">Finalizing</span>
		</div>
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

	.processing-steps {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-top: 1.5rem;
		width: 100%;
		max-width: 500px;
	}

	.step {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1rem;
		background: #f0f0f0;
		border: 2px solid #000;
		border-radius: 8px;
		transition: all 0.3s ease;
		min-width: 100px;
		opacity: 0.5;
	}

	.step.active {
		background: #ffd93d;
		opacity: 1;
		animation: stepPulse 1s ease-in-out infinite;
	}

	.step.complete {
		background: #98fb98;
		opacity: 1;
		animation: none;
	}

	@keyframes stepPulse {
		0%,
		100% {
			transform: scale(1);
		}
		50% {
			transform: scale(1.05);
		}
	}

	.step-number {
		width: 30px;
		height: 30px;
		background: #000;
		color: #fff;
		border-radius: 50%;
		display: flex;
		align-items: center;
		justify-content: center;
		font-weight: 700;
		font-size: 0.875rem;
	}

	.step.active .step-number {
		background: #fff;
		color: #000;
		border: 2px solid #000;
	}

	.step.complete .step-number {
		background: #000;
		color: #98fb98;
	}

	.step-text {
		font-size: 0.8125rem;
		font-weight: 600;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 0.5px;
	}

	@media (max-width: 600px) {
		.processing {
			padding: 1.75rem;
		}

		.processing h3 {
			font-size: 2rem;
		}

		.processing-steps {
			gap: 0.75rem;
		}

		.step {
			min-width: 80px;
			padding: 0.75rem;
		}

		.processing-message {
			font-size: 0.875rem;
			padding: 0.875rem 1rem;
		}
	}
</style>
