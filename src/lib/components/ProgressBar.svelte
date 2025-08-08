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
				? '0.5s'
				: '0s'} ease"
		></div>
		<div class="progress-label" style="left: {Math.min(progress, 90)}%">
			{progress}%
		</div>
	</div>
	<div class="progress-decoration"></div>
</div>

<style>
	.progress-container {
		width: 100%;
		margin: 0.5rem 0;
		position: relative;
	}

	.progress-bar {
		height: 2rem;
		background: #FFF;
		border: 3px solid #000;
		overflow: hidden;
		width: 100%;
		box-shadow: 5px 5px 0 #000;
		position: relative;
	}

	.progress-bar-fill {
		height: 100%;
		background: repeating-linear-gradient(
			45deg,
			#FFD93D,
			#FFD93D 10px,
			#FF69B4 10px,
			#FF69B4 20px,
			#98FB98 20px,
			#98FB98 30px
		);
		border-right: 3px solid #000;
		position: relative;
	}

	.progress-bar-fill.animated {
		background-size: 60px 60px;
		animation: progress-animation 1s linear infinite;
	}

	@keyframes progress-animation {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 60px 0;
		}
	}

	.progress-label {
		position: absolute;
		top: 50%;
		transform: translateY(-50%);
		background: #000;
		color: #FFD93D;
		padding: 2px 8px;
		font-size: 0.875rem;
		font-weight: 700;
		border: 2px solid #000;
		transition: left 0.5s ease;
		z-index: 10;
		white-space: nowrap;
	}

	.progress-decoration {
		position: absolute;
		bottom: -8px;
		left: 0;
		right: 0;
		height: 4px;
		background: repeating-linear-gradient(
			90deg,
			#000,
			#000 10px,
			transparent 10px,
			transparent 20px
		);
	}
</style>
