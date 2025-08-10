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
				? '0.3s'
				: '0s'} ease"
		></div>
	</div>
</div>

<style>
	.progress-container {
		width: 100%;
		margin: 0.5rem 0;
	}

	.progress-bar {
		height: 1rem;
		background: rgba(82, 121, 82, 0.1);
		border: 1px solid rgba(82, 121, 82, 0.2);
		border-radius: 12px;
		overflow: hidden;
		width: 100%;
		position: relative;
		backdrop-filter: blur(4px);
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, #527952 0%, #6b8e6b 100%);
		position: relative;
		transition: width 0.3s ease;
		border-radius: 12px;
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
			rgba(255, 255, 255, 0.2) 50%,
			transparent 100%
		);
		animation: gentle-shimmer 2s infinite;
	}

	@keyframes gentle-shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}
</style>
