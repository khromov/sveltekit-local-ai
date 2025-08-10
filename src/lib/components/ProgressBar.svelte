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
				: '0s'} cubic-bezier(0.4, 0, 0.2, 1)"
		>
			<div class="progress-shimmer"></div>
		</div>
		<!-- Nature elements -->
		<svg
			class="progress-decoration"
			width="100%"
			height="100%"
			style="position: absolute; top: 0; left: 0; pointer-events: none;"
		>
			<defs>
				<pattern
					id="progress-pattern"
					x="0"
					y="0"
					width="40"
					height="20"
					patternUnits="userSpaceOnUse"
				>
					<circle cx="10" cy="10" r="1" fill="currentColor" opacity="0.1" />
					<circle cx="30" cy="10" r="1.5" fill="currentColor" opacity="0.1" />
				</pattern>
			</defs>
			<rect width="100%" height="100%" fill="url(#progress-pattern)" />
		</svg>
	</div>
</div>

<style>
	.progress-container {
		width: 100%;
		margin: 0.5rem 0;
		position: relative;
	}

	.progress-bar {
		height: 12px;
		background: linear-gradient(90deg, rgba(240, 240, 240, 0.5) 0%, rgba(245, 245, 245, 0.5) 100%);
		border: 1px solid rgba(139, 111, 71, 0.15);
		border-radius: 12px;
		overflow: hidden;
		width: 100%;
		position: relative;
		box-shadow:
			inset 0 1px 3px rgba(139, 111, 71, 0.1),
			0 1px 0 rgba(255, 255, 255, 0.5);
	}

	.progress-bar-fill {
		height: 100%;
		background: linear-gradient(90deg, var(--forest-light) 0%, var(--forest-primary) 100%);
		position: relative;
		border-radius: 12px;
		overflow: hidden;
		box-shadow: 0 1px 3px rgba(45, 90, 61, 0.2);
	}

	.progress-shimmer {
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
		animation: shimmer 2s infinite;
		transform: translateX(-100%);
	}

	.progress-bar-fill.animated .progress-shimmer {
		animation: shimmer 2s infinite;
	}

	@keyframes shimmer {
		0% {
			transform: translateX(-100%);
		}
		100% {
			transform: translateX(100%);
		}
	}

	.progress-decoration {
		color: var(--forest-primary);
	}
</style>
