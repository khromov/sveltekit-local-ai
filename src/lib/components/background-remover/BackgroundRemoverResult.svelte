<script lang="ts">
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

	function shareImage() {
		if ('share' in navigator && typeof navigator.share === 'function') {
			fetch(processedImageUrl)
				.then((response) => response.blob())
				.then((blob) => {
					const file = new File([blob], downloadName, { type: 'image/png' });
					return navigator.share({
						title: 'Background Removed Image',
						files: [file]
					});
				})
				.catch(console.error);
		} else {
			// Fallback: copy to clipboard
			copyImageToClipboard();
		}
	}

	async function copyImageToClipboard() {
		try {
			const response = await fetch(processedImageUrl);
			const blob = await response.blob();
			const item = new ClipboardItem({ 'image/png': blob });
			await navigator.clipboard.write([item]);
			alert('Image copied to clipboard!');
		} catch (err) {
			console.error('Failed to copy image:', err);
		}
	}
</script>

<div class="result-wrapper">
	<div class="result">
		<div class="result-decoration"></div>
		<div class="result-content">
			<div class="result-header">
				<h3>
					<span class="header-icon">✨</span>
					Background Removed!
				</h3>
				<div class="result-actions">
					<button class="comparison-toggle" onclick={() => (showComparison = !showComparison)}>
						{showComparison ? '🖼️ Processed' : '⚖️ Compare'}
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
					<span class="btn-icon">💾</span>
					Download
				</button>

				{#if 'share' in navigator || 'clipboard' in navigator}
					<button class="share-btn" onclick={shareImage}>
						<span class="btn-icon">📤</span>
						Share
					</button>
				{/if}

				<button class="process-another-btn" onclick={onProcessAnother}>
					<span class="btn-icon">🔄</span>
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
		background: linear-gradient(135deg, #98fb98 0%, #87ceeb 100%);
		z-index: -1;
		opacity: 0.3;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		transform: rotate(-1deg);
	}

	.result-content {
		padding: 2rem;
		background: #fff;
		border: 4px solid #000;
		box-shadow: 8px 8px 0 #000;
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
		border-bottom: 3px solid #000;
	}

	.result-content h3 {
		margin: 0;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.75rem;
		color: #000;
		letter-spacing: 2px;
		display: flex;
		align-items: center;
		gap: 0.5rem;
		background: #98fb98;
		padding: 0.5rem 1rem;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		transform: rotate(-1deg);
		text-transform: uppercase;
	}

	.header-icon {
		font-size: 1.5rem;
		animation: sparkle 2s ease-in-out infinite;
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
		background: #ffd93d;
		color: #000;
		border: 3px solid #000;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-shadow: 3px 3px 0 #000;
	}

	.comparison-toggle:hover {
		transform: translate(-1px, -1px);
		box-shadow: 4px 4px 0 #000;
		background: #ff69b4;
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
		border: 3px solid #000;
		border-radius: 8px;
		overflow: hidden;
		background: #fff;
	}

	.transparent-bg-pattern {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		background-image:
			linear-gradient(45deg, #e0e0e0 25%, transparent 25%),
			linear-gradient(-45deg, #e0e0e0 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #e0e0e0 75%),
			linear-gradient(-45deg, transparent 75%, #e0e0e0 75%);
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
		border: 3px solid #000;
		border-radius: 8px;
		padding: 1.5rem;
		background: #f5f5f5;
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
		color: #000;
		text-transform: uppercase;
		letter-spacing: 1px;
		background: #ffd93d;
		padding: 0.5rem 1rem;
		border: 2px solid #000;
		box-shadow: 3px 3px 0 #000;
	}

	.image-side img {
		max-width: 100%;
		max-height: 300px;
		border: 2px solid #000;
		border-radius: 4px;
		box-shadow: 3px 3px 0 #000;
	}

	.action-buttons {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		justify-content: center;
		margin-top: 1.5rem;
	}

	.download-btn,
	.share-btn,
	.process-another-btn {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.75rem 1.25rem;
		border: 3px solid #000;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-shadow: 4px 4px 0 #000;
		border-radius: 6px;
	}

	.download-btn {
		background: #98fb98;
		color: #000;
	}

	.share-btn {
		background: #87ceeb;
		color: #000;
	}

	.process-another-btn {
		background: #ffd93d;
		color: #000;
	}

	.download-btn:hover,
	.share-btn:hover,
	.process-another-btn:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
	}

	.download-btn:hover {
		background: #90ee90;
	}

	.share-btn:hover {
		background: #87cefa;
	}

	.process-another-btn:hover {
		background: #ffa500;
	}

	.btn-icon {
		font-size: 1.25rem;
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
		.share-btn,
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
		.share-btn,
		.process-another-btn {
			width: 100%;
		}
	}
</style>
