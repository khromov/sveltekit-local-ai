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
		height: 1.25rem;
		background: #F0F0F0;
		border: 2px solid #000;
		border-radius: 6px;
		overflow: hidden;
		width: 100%;
		position: relative;
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, #FFD700 0%, #FFA500 100%);
		position: relative;
		transition: width 0.3s ease;
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
			rgba(255, 255, 255, 0.3) 50%,
			transparent 100%
		);
		animation: shimmer 1.5s infinite;
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
