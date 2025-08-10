<script lang="ts">
	interface Props {
		progress: number;
		previousProgress?: number;
		animated?: boolean;
	}

	let { progress = 0, previousProgress = 0, animated = true }: Props = $props();
</script>

<div class="progress-container">
	<div class="progress-bar">
		<div
			class="progress-bar-fill"
			class:animated
			style="width: {progress}%; transition: width {animated && progress > previousProgress
				? '0.4s'
				: '0s'} ease-out"
		></div>
		<div class="progress-bar-glow"></div>
	</div>
</div>

<style>
	.progress-container {
		width: 100%;
		margin: 0.75rem 0;
	}

	.progress-bar {
		height: 1rem;
		background: linear-gradient(
			90deg,
			rgba(168, 160, 144, 0.2) 0%,
			rgba(230, 221, 212, 0.3) 50%,
			rgba(168, 160, 144, 0.2) 100%
		);
		border: 1px solid var(--earth-medium);
		border-radius: 1rem;
		overflow: hidden;
		width: 100%;
		position: relative;
		box-shadow:
			inset 0 2px 4px rgba(139, 111, 71, 0.1),
			0 1px 3px rgba(139, 111, 71, 0.1);
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--mocha-mousse) 0%, var(--clay) 50%, var(--sage) 100%);
		position: relative;
		transition: width 0.4s ease-out;
		border-radius: 1rem;
		box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.2);
	}

	.progress-bar-fill.animated::after {
		content: '';
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(255, 255, 255, 0.4) 50%,
			transparent 100%
		);
		animation: shimmer 2s ease-in-out infinite;
		border-radius: 1rem;
	}

	.progress-bar-glow {
		position: absolute;
		top: -2px;
		left: -2px;
		right: -2px;
		bottom: -2px;
		background: linear-gradient(
			90deg,
			transparent 0%,
			rgba(167, 132, 106, 0.3) 50%,
			transparent 100%
		);
		border-radius: 1rem;
		opacity: 0;
		transition: opacity 0.3s ease;
		z-index: -1;
	}

	.progress-bar:hover .progress-bar-glow {
		opacity: 1;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
