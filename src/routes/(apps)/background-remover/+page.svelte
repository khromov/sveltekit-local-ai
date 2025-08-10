<script lang="ts">
	import { AutoModel, AutoProcessor, RawImage } from '@huggingface/transformers';
	import { onMount, onDestroy } from 'svelte';
	import { useWakeLock } from '$lib/wakeLock.svelte';

	import BackgroundRemoverFileUpload from '$lib/components/background-remover/BackgroundRemoverFileUpload.svelte';
	import BackgroundRemoverProgress from '$lib/components/background-remover/BackgroundRemoverProgress.svelte';
	import BackgroundRemoverResult from '$lib/components/background-remover/BackgroundRemoverResult.svelte';
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

	let isModelLoaded = $state(false);
	let isLoadingModel = $state(false);
	let isProcessing = $state(false);
	let error = $state(false);
	let errorMessage = $state('');
	let modelLoadProgress = $state(0);
	let processingProgress = $state(0);
	let selectedFile: File | null = $state(null);
	let processedImageUrl = $state<string | null>(null);
	let originalImageUrl = $state<string | null>(null);

	let model: any = null;
	let processor: any = null;

	const EXAMPLE_URL =
		'https://images.pexels.com/photos/5965592/pexels-photo-5965592.jpeg?auto=compress&cs=tinysrgb&w=1024';

	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	onMount(() => {
		return setupWakeLock(() => isProcessing || isLoadingModel);
	});

	async function loadModel() {
		try {
			isLoadingModel = true;
			error = false;
			modelLoadProgress = 0;

			await requestWakeLock();

			// Load model and processor
			modelLoadProgress = 25;
			model = await AutoModel.from_pretrained('briaai/RMBG-1.4', {
				config: { model_type: 'custom' }
			});

			modelLoadProgress = 75;
			processor = await AutoProcessor.from_pretrained('briaai/RMBG-1.4', {
				config: {
					do_normalize: true,
					do_pad: false,
					do_rescale: true,
					do_resize: true,
					image_mean: [0.5, 0.5, 0.5],
					feature_extractor_type: 'ImageFeatureExtractor',
					image_std: [1, 1, 1],
					resample: 2,
					rescale_factor: 0.00392156862745098,
					size: { width: 1024, height: 1024 }
				}
			});

			modelLoadProgress = 100;
			isModelLoaded = true;
		} catch (err) {
			console.error('Model loading error:', err);
			error = true;
			errorMessage =
				'Failed to load background removal model. Please check your connection and try again.';
		} finally {
			isLoadingModel = false;
			await releaseWakeLock();
		}
	}

	async function processImage(imageUrl: string) {
		if (!model || !processor) return;

		try {
			isProcessing = true;
			processingProgress = 0;

			await requestWakeLock();

			// Read image
			processingProgress = 20;
			const image = await RawImage.fromURL(imageUrl);
			originalImageUrl = imageUrl;

			// Preprocess image
			processingProgress = 40;
			const { pixel_values } = await processor(image);

			// Predict alpha matte
			processingProgress = 70;
			const { output } = await model({ input: pixel_values });

			// Resize mask back to original size
			processingProgress = 85;
			const mask = await RawImage.fromTensor(output[0].mul(255).to('uint8')).resize(
				image.width,
				image.height
			);
			image.putAlpha(mask);

			// Create new canvas
			processingProgress = 95;
			const canvas = document.createElement('canvas');
			canvas.width = image.width;
			canvas.height = image.height;
			const ctx = canvas.getContext('2d');
			ctx?.drawImage(image.toCanvas(), 0, 0);

			// Convert to blob URL
			canvas.toBlob((blob) => {
				if (blob) {
					if (processedImageUrl) {
						URL.revokeObjectURL(processedImageUrl);
					}
					processedImageUrl = URL.createObjectURL(blob);
				}
			}, 'image/png');

			processingProgress = 100;
		} catch (err) {
			console.error('Processing error:', err);
			error = true;
			errorMessage = 'Failed to process image. Please try again.';
		} finally {
			isProcessing = false;
			await releaseWakeLock();
		}
	}

	function handleFileSelect(file: File) {
		selectedFile = file;
		const url = URL.createObjectURL(file);
		processImage(url);
	}

	function handleExampleUse() {
		processImage(EXAMPLE_URL);
	}

	function clearResults() {
		if (processedImageUrl) {
			URL.revokeObjectURL(processedImageUrl);
			processedImageUrl = null;
		}
		if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
			URL.revokeObjectURL(originalImageUrl);
		}
		originalImageUrl = null;
		selectedFile = null;
		error = false;
	}

	function retry() {
		error = false;
		if (!isModelLoaded) {
			loadModel();
		}
	}

	onDestroy(() => {
		if (processedImageUrl) {
			URL.revokeObjectURL(processedImageUrl);
		}
		if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
			URL.revokeObjectURL(originalImageUrl);
		}
	});
</script>

{#if !isModelLoaded}
	<div class="loading">
		{#if error}
			<ErrorDisplay
				message={errorMessage}
				buttonText={isLoadingModel ? 'Loading...' : 'Retry'}
				onRetry={retry}
				isRetrying={isLoadingModel}
			/>
		{:else if isLoadingModel}
			<LoadingProgress
				title="Loading Background Removal Model"
				progress={modelLoadProgress}
				message="The AI model is being downloaded and initialized. This may take a few moments."
			/>
		{:else}
			<div class="model-selector">
				<div class="selector-decoration"></div>
				<h2>
					<span class="title-icon">🖼️</span>
					Background Remover
				</h2>
				<p class="description">
					Remove backgrounds from images using AI. Powered by the RMBG v1.4 model from BRIA AI.
				</p>
				<button onclick={loadModel} class="load-button primary-button">
					<span class="button-icon">⚡</span>
					Load Model
				</button>
			</div>
		{/if}
	</div>
{:else}
	<div class="card-interface background-remover-interface">
		<div class="floating-decoration decoration-1"></div>
		<div class="floating-decoration decoration-2"></div>

		<div class="toolbar">
			<span class="model-info">
				<span class="model-emoji">🖼️</span>
				Background Remover (RMBG v1.4)
			</span>
			<button onclick={clearResults} class="clear-btn" aria-label="Clear Results">
				<span class="btn-emoji">🗑️</span>
				Clear
			</button>
			<div class="toolbar-decoration"></div>
		</div>

		<div class="content-area">
			{#if !isProcessing && !processedImageUrl}
				<BackgroundRemoverFileUpload
					{selectedFile}
					onFileSelect={handleFileSelect}
					onExampleUse={handleExampleUse}
					disabled={isProcessing}
				/>
			{/if}

			{#if isProcessing}
				<BackgroundRemoverProgress
					progress={processingProgress}
					message="Processing image and removing background..."
				/>
			{/if}

			{#if error}
				<ErrorDisplay message={errorMessage} buttonText="Try Again" onRetry={retry} />
			{/if}

			{#if processedImageUrl && originalImageUrl && !isProcessing}
				<BackgroundRemoverResult
					{originalImageUrl}
					{processedImageUrl}
					onProcessAnother={clearResults}
				/>
			{/if}
		</div>
	</div>
{/if}

<style>
	.loading {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2rem;
		margin: 2rem 0;
		animation: fadeIn 0.4s ease-out;
		width: 100%;
		box-sizing: border-box;
		overflow-x: hidden;
		padding: 0;
	}

	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.model-selector {
		width: calc(100% - 4rem);
		max-width: 500px;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
		padding: 2rem;
		background: #fff;
		border: 4px solid #000;
		box-shadow: 8px 8px 0 #000;
		margin: 0 auto;
		border-radius: 12px;
		animation: bounceIn 0.6s ease-out;
		box-sizing: border-box;
		position: relative;
		transform: rotate(0.5deg);
	}

	@keyframes bounceIn {
		0% {
			opacity: 0;
			transform: scale(0.9) rotate(-1deg);
		}
		50% {
			transform: scale(1.05) rotate(1deg);
		}
		100% {
			opacity: 1;
			transform: scale(1) rotate(0.5deg);
		}
	}

	.selector-decoration {
		position: absolute;
		top: -15px;
		left: -15px;
		width: 100px;
		height: 100px;
		background: linear-gradient(135deg, #ffd93d 0%, #98fb98 100%);
		border: 3px solid #000;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		opacity: 0.3;
		z-index: -1;
		animation: spin 15s linear infinite;
	}

	@keyframes spin {
		from {
			transform: rotate(0deg);
		}
		to {
			transform: rotate(360deg);
		}
	}

	.model-selector h2 {
		font-size: 2rem;
		font-weight: 700;
		margin: 0;
		color: #000;
		text-align: center;
		text-transform: uppercase;
		letter-spacing: 2px;
		font-family: 'Bebas Neue', sans-serif;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		background: linear-gradient(135deg, #ffd93d 0%, #98fb98 100%);
		padding: 0.75rem 1.5rem;
		border: 3px solid #000;
		box-shadow: 5px 5px 0 #000;
		transform: rotate(-1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.title-icon {
		font-size: 1.75rem;
		animation: bounce 2s ease-in-out infinite;
	}

	@keyframes bounce {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-5px);
		}
	}

	.description {
		text-align: center;
		font-size: 1rem;
		color: #333;
		line-height: 1.5;
		margin: 0;
		background: linear-gradient(135deg, rgba(255, 217, 61, 0.1) 0%, rgba(152, 251, 152, 0.1) 100%);
		padding: 1rem;
		border: 2px dashed #000;
		border-radius: 8px;
	}

	.load-button {
		padding: 1rem 1.5rem;
		font-size: 1.125rem;
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 0.5rem;
		margin: 0 auto;
		background: #98fb98;
		transform: rotate(-1deg);
	}

	.load-button:hover:not(:disabled) {
		background: #ffd93d;
		transform: translate(-3px, -3px) rotate(0deg);
		box-shadow: 8px 8px 0 #000;
	}

	.button-icon {
		font-size: 1.5rem;
	}

	.background-remover-interface {
		position: relative;
		transform: rotate(0deg);
		animation: slideInChat 0.5s ease-out;
		display: flex;
		flex-direction: column;
		min-height: 400px;
	}

	@keyframes slideInChat {
		from {
			opacity: 0;
			transform: translateY(20px) rotate(0deg);
		}
		to {
			opacity: 1;
			transform: translateY(0) rotate(0deg);
		}
	}

	.floating-decoration {
		position: absolute;
		background: linear-gradient(135deg, #ffd93d 0%, #ff69b4 100%);
		border: 3px solid #000;
		opacity: 0.2;
		z-index: -1;
		pointer-events: none;
	}

	.decoration-1 {
		width: 80px;
		height: 80px;
		top: -20px;
		right: -20px;
		border-radius: 30% 70% 70% 30% / 60% 40% 60% 40%;
		animation: float1 8s ease-in-out infinite;
	}

	.decoration-2 {
		width: 60px;
		height: 60px;
		bottom: 100px;
		left: -15px;
		border-radius: 70% 30% 30% 70% / 40% 60% 40% 60%;
		animation: float2 10s ease-in-out infinite;
	}

	@keyframes float1 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(-10px, 10px) rotate(180deg);
		}
	}

	@keyframes float2 {
		0%,
		100% {
			transform: translate(0, 0) rotate(0deg);
		}
		50% {
			transform: translate(10px, -10px) rotate(-180deg);
		}
	}

	.toolbar-decoration {
		position: absolute;
		bottom: -6px;
		left: 0;
		right: 0;
		height: 3px;
		background: repeating-linear-gradient(90deg, #000, #000 8px, #98fb98 8px, #98fb98 16px);
	}

	.model-emoji {
		font-size: 1.125rem;
		margin-right: 0.25rem;
	}

	.btn-emoji {
		font-size: 1rem;
	}

	.clear-btn {
		padding: 0.5rem 1rem;
		background: #ff6b6b;
		color: #000;
		border: 2px solid #000;
		border-radius: 6px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		white-space: nowrap;
		box-shadow: 3px 3px 0 #000;
		display: flex;
		align-items: center;
		gap: 0.375rem;
		transform: rotate(0deg);
	}

	.clear-btn:hover {
		transform: translate(-2px, -2px) rotate(0deg);
		box-shadow: 5px 5px 0 #000;
		background: #ffd93d;
	}

	@media (max-width: 600px) {
		.loading {
			align-items: stretch;
			margin: 1rem 0;
		}

		.model-selector {
			width: calc(100% - 2rem);
			padding: 1.5rem 1rem;
			max-width: none;
			margin: 0 1rem;
		}

		.clear-btn {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}

		.decoration-1,
		.decoration-2 {
			display: none;
		}
	}

	@media (max-width: 400px) {
		.loading {
			margin: 0.5rem 0;
		}

		.model-selector {
			width: calc(100% - 1rem);
			margin: 0 0.5rem;
			padding: 1.25rem 0.75rem;
		}

		.model-selector h2 {
			font-size: 1.5rem;
		}
	}
</style>
