<script lang="ts">
	import SparklesIcon from 'virtual:icons/lucide/sparkles';
	import ImageIcon from 'virtual:icons/lucide/image';
	import ScaleIcon from 'virtual:icons/lucide/scale';
	import SaveIcon from 'virtual:icons/lucide/save';
	import RotateCwIcon from 'virtual:icons/lucide/rotate-cw';

	interface Props {
		originalImageUrl: string;
		processedImageUrl: string;
		onProcessAnother: () => void;
	}

	let { originalImageUrl, processedImageUrl, onProcessAnother }: Props = $props();

	let showComparison = $state(false);
	let downloadName = $state('background-removed.png');

	function downloadImage() {
		const link = document.createElement('a');
		link.href = processedImageUrl;
		link.download = downloadName;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}
</script>

<div class="result-wrapper">
	<div class="result">
		<div class="result-decoration"></div>
		<div class="result-content">
			<div class="result-header">
				<h3>
					<span class="header-icon"><SparklesIcon /></span>
					Background Removed!
				</h3>
				<div class="result-actions">
					<button class="comparison-toggle" onclick={() => (showComparison = !showComparison)}>
						{#if showComparison}
							<ImageIcon />
							Processed
						{:else}
							<ScaleIcon />
							Compare
						{/if}
					</button>
				</div>
			</div>

			<div class="image-container">
				{#if showComparison}
					<div class="comparison-view">
						<div class="image-side">
							<h4>Original</h4>
							<img src={originalImageUrl} alt="Original" />
						</div>
						<div class="image-side">
							<h4>Background Removed</h4>
							<img src={processedImageUrl} alt="Background removed" />
						</div>
					</div>
				{:else}
					<div class="single-view">
						<img src={processedImageUrl} alt="Background removed" class="processed-image" />
						<div class="transparent-bg-pattern"></div>
					</div>
				{/if}
			</div>

			<div class="action-buttons">
				<button class="download-btn" onclick={downloadImage}>
					<span class="btn-icon"><SaveIcon /></span>
					Download
				</button>

				<button class="process-another-btn" onclick={onProcessAnother}>
					<span class="btn-icon"><RotateCwIcon /></span>
					Process Another
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	.result-wrapper {
		display: flex;
		margin: 1.5rem 0;
		width: 100%;
		animation: resultSlide 0.5s ease-out;
	}

	@keyframes resultSlide {
		from {
			transform: translateY(20px) rotate(-1deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(0.5deg);
			opacity: 1;
		}
	}

	.result {
		position: relative;
		width: 100%;
		max-width: 100%;
		transform: rotate(0.5deg);
	}

	.result-decoration {
		position: absolute;
		top: -10px;
		left: -10px;
		right: -10px;
		bottom: -10px;
		background: linear-gradient(135deg, var(--color-success) 0%, var(--color-accent-blue) 100%);
		z-index: -1;
		opacity: 0.3;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		transform: rotate(-1deg);
	}

	.result-content {
		padding: 2rem;
		background: var(--color-background-main);
		border: var(--border-brutalist-extra-thick);
		box-shadow: var(--shadow-brutalist-xlarge);
		position: relative;
	}

	.result-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
		padding-bottom: 1rem;
		border-bottom: var(--border-brutalist-thick);
	}

	.result-content h3 {
		margin: 0;
		font-family: var(--font-family-display);
		font-size: 1.75rem;
		color: var(--color-text-primary);
		letter-spacing: 2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: var(--color-success);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thick);
		box-shadow: var(--shadow-brutalist-medium);
		transform: rotate(-1deg);
		text-transform: uppercase;
	}

	.header-icon {
		font-size: 1.5rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
		animation: sparkle 2s ease-in-out infinite;
	}

	.header-icon :global(svg) {
		width: 1.5rem;
		height: 1.5rem;
	}

	@keyframes sparkle {
		0%,
		100% {
			transform: scale(1) rotate(0deg);
		}
		50% {
			transform: scale(1.2) rotate(180deg);
		}
	}

	.comparison-toggle {
		padding: 0.5rem 1rem;
		background: var(--color-primary-dark);
		color: var(--color-text-primary);
		border: var(--border-brutalist-thick);
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-small);
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.comparison-toggle :global(svg) {
		width: 1.125rem;
		height: 1.125rem;
	}

	.comparison-toggle:hover {
		transform: translate(-1px, -1px);
		box-shadow: var(--shadow-brutalist-medium);
		background: var(--color-accent-pink);
	}

	.image-container {
		margin: 1.5rem 0;
		position: relative;
	}

	.single-view {
		position: relative;
		display: flex;
		justify-content: center;
		align-items: center;
		min-height: 300px;
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		overflow: hidden;
		background: var(--color-background-main);
	}

	.transparent-bg-pattern {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			linear-gradient(45deg, var(--color-background-pattern) 25%, transparent 25%),
			linear-gradient(-45deg, var(--color-background-pattern) 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, var(--color-background-pattern) 75%),
			linear-gradient(-45deg, transparent 75%, var(--color-background-pattern) 75%);
		background-size: 20px 20px;
		background-position:
			0 0,
			0 10px,
			10px -10px,
			-10px 0px;
		z-index: 0;
	}

	.processed-image {
		max-width: 100%;
		max-height: 500px;
		border-radius: 4px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
		position: relative;
		z-index: 1;
	}

	.comparison-view {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1.5rem;
		border: var(--border-brutalist-thick);
		border-radius: 8px;
		padding: 1.5rem;
		background: var(--color-background-secondary);
	}

	.image-side {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 1rem;
	}

	.image-side h4 {
		margin: 0;
		font-size: 1rem;
		font-weight: 700;
		color: var(--color-text-primary);
		text-transform: uppercase;
		letter-spacing: 1px;
		background: var(--color-primary-dark);
		padding: 0.5rem 1rem;
		border: var(--border-brutalist-thin);
		box-shadow: var(--shadow-brutalist-small);
	}

	.image-side img {
		max-width: 100%;
		max-height: 300px;
		border: var(--border-brutalist-thin);
		border-radius: 4px;
		box-shadow: var(--shadow-brutalist-small);
	}

	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-top: 1.5rem;
	}

	.download-btn,
	.process-another-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border: var(--border-brutalist-thick);
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: var(--font-family-primary);
		box-shadow: var(--shadow-brutalist-medium);
		border-radius: 6px;
	}

	.download-btn {
		background: var(--color-success);
		color: var(--color-text-primary);
	}

	.process-another-btn {
		background: var(--color-primary-dark);
		color: var(--color-text-primary);
	}

	.download-btn:hover,
	.process-another-btn:hover {
		transform: translate(-2px, -2px);
		box-shadow: var(--shadow-brutalist-large);
	}

	.download-btn:hover {
		background: var(--color-success-hover);
	}

	.process-another-btn:hover {
		background: var(--color-warning);
	}

	.btn-icon {
		font-size: 1.25rem;
		display: flex;
		align-items: center;
		color: var(--color-text-primary);
	}

	.btn-icon :global(svg) {
		width: 1.25rem;
		height: 1.25rem;
	}

	@media (max-width: 768px) {
		.result-content {
			padding: 1.5rem;
		}

		.result-header {
			flex-direction: column;
			align-items: stretch;
			gap: 1rem;
		}

		.comparison-view {
			grid-template-columns: 1fr;
			gap: 1rem;
			padding: 1rem;
		}

		.action-buttons {
			gap: 0.75rem;
		}

		.download-btn,
		.process-another-btn {
			flex: 1;
			min-width: 120px;
			justify-content: center;
		}
	}

	@media (max-width: 600px) {
		.result-content {
			padding: 1.25rem;
		}

		.result-content h3 {
			font-size: 1.5rem;
		}

		.download-btn,
		.process-another-btn {
			width: 100%;
		}
	}
</style>
