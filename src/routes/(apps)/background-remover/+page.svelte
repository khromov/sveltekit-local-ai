<script lang="ts">
	import { pipeline, env } from '@huggingface/transformers';
	import { onMount, onDestroy } from 'svelte';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	import JSZip from 'jszip';

	import BackgroundRemoverUpload from '$lib/components/background-remover/BackgroundRemoverUpload.svelte';
	import BackgroundRemoverProgress from '$lib/components/background-remover/BackgroundRemoverProgress.svelte';
	import BackgroundRemoverResult from '$lib/components/background-remover/BackgroundRemoverResult.svelte';
	import BackgroundRemoverBatchResult from '$lib/components/background-remover/BackgroundRemoverBatchResult.svelte';
	import LoadingProgress from '$lib/components/LoadingProgress.svelte';
	import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
	import { BASE_MODEL_URL } from '$lib/config';

	let isModelLoaded = $state(false);
	let isLoadingModel = $state(false);
	let isProcessing = $state(false);
	let error = $state(false);
	let errorMessage = $state('');
	let modelLoadProgress = $state(0);
	let processingProgress = $state(0);

	// Configure custom model URL
	env.remoteHost = `${BASE_MODEL_URL}/bgremoval/`;
	env.remotePathTemplate = '{model}/';

	// Mode selection
	let processingMode = $state<'single' | 'batch'>('single');

	// Model selection
	const AVAILABLE_MODELS = [
		{
			id: 'RMBG-1.4', //briaai/
			name: 'RMBG v1.4',
			description: 'Smaller and faster, runs on most devices'
		},
		{
			id: 'BEN2-ONNX', //briaai/
			name: 'BEN2',
			description: 'Larger with potentially better results'
		}
	];
	let selectedModelId = $state('RMBG-1.4');

	// Single image mode
	let selectedFile: File | null = $state(null);
	let processedImageUrl = $state<string | null>(null);
	let originalImageUrl = $state<string | null>(null);

	// Batch mode
	let selectedFiles: File[] = $state([]);
	let batchResults: Array<{
		file: File;
		originalUrl: string;
		processedUrl: string | null;
		error?: string;
	}> = $state([]);
	let currentBatchIndex = $state(0);
	let totalBatchCount = $state(0);

	let segmenter: any = null;

	const EXAMPLE_URL = '/pexels-photo-5965592.jpeg';

	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	onMount(() => {
		const cleanup = setupWakeLock(() => isProcessing || isLoadingModel);
		// Auto-load model when page loads
		loadModel();
		return cleanup;
	});

	async function loadModel() {
		try {
			isLoadingModel = true;
			error = false;
			modelLoadProgress = 0;

			await requestWakeLock();

			// Load the background removal pipeline
			modelLoadProgress = 25;
			segmenter = await pipeline('background-removal', selectedModelId, {
				progress_callback: (progress: any) => {
					// Update progress based on pipeline loading
					if (progress.status === 'downloading') {
						modelLoadProgress = Math.round(25 + (progress.progress || 0) * 0.5);
					} else if (progress.status === 'ready') {
						modelLoadProgress = 100;
					}
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

	async function processImage(imageUrl: string): Promise<string | null> {
		if (!segmenter) return null;

		try {
			// Process the image using the pipeline
			const output = await segmenter(imageUrl);

			// The pipeline returns an array with the processed image
			if (output && output.length > 0) {
				// The output is a RawImage, create a proper HTML canvas
				const rawImage = output[0];
				const tempCanvas = rawImage.toCanvas();

				// Create a new HTML canvas element
				const canvas = document.createElement('canvas');
				canvas.width = rawImage.width;
				canvas.height = rawImage.height;
				const ctx = canvas.getContext('2d');

				// Draw the image onto the HTML canvas
				ctx?.drawImage(tempCanvas, 0, 0);

				return new Promise((resolve) => {
					canvas.toBlob((blob) => {
						if (blob) {
							resolve(URL.createObjectURL(blob));
						} else {
							resolve(null);
						}
					}, 'image/png');
				});
			}
			return null;
		} catch (err) {
			console.error('Error processing image:', err);
			return null;
		}
	}

	async function handleSingleImageProcessing(imageUrl: string) {
		try {
			isProcessing = true;
			processingProgress = 0;
			originalImageUrl = imageUrl;

			await requestWakeLock();

			// Simulate progress steps
			processingProgress = 25;
			await new Promise((resolve) => setTimeout(resolve, 100));

			processingProgress = 50;
			const result = await processImage(imageUrl);

			processingProgress = 100;

			if (processedImageUrl) {
				URL.revokeObjectURL(processedImageUrl);
			}
			processedImageUrl = result;
		} catch (err) {
			console.error('Processing error:', err);
			error = true;
			errorMessage = 'Failed to process image. Please try again.';
		} finally {
			isProcessing = false;
			await releaseWakeLock();
		}
	}

	async function handleBatchProcessing(files: File[]) {
		try {
			isProcessing = true;
			processingProgress = 0;
			currentBatchIndex = 0;
			totalBatchCount = files.length;

			// Initialize batch results
			batchResults = files.map((file) => ({
				file,
				originalUrl: URL.createObjectURL(file),
				processedUrl: null
			}));

			await requestWakeLock();

			// Process each image
			for (let i = 0; i < files.length; i++) {
				currentBatchIndex = i + 1;
				processingProgress = Math.round((i / files.length) * 100);

				try {
					const result = await processImage(batchResults[i].originalUrl);
					batchResults[i].processedUrl = result;
				} catch (err) {
					console.error(`Error processing image ${i + 1}:`, err);
					batchResults[i].error = 'Processing failed';
				}

				// Update reactivity
				batchResults = [...batchResults];
			}

			processingProgress = 100;
		} catch (err) {
			console.error('Batch processing error:', err);
			error = true;
			errorMessage = 'Failed to process batch. Please try again.';
		} finally {
			isProcessing = false;
			await releaseWakeLock();
		}
	}

	function handleSingleFileSelect(file: File) {
		selectedFile = file;
		const url = URL.createObjectURL(file);
		handleSingleImageProcessing(url);
	}

	function handleBatchFileSelect(files: File[]) {
		selectedFiles = files;
		handleBatchProcessing(files);
	}

	function handleExampleUse() {
		if (processingMode === 'single') {
			handleSingleImageProcessing(EXAMPLE_URL);
		}
	}

	function clearResults() {
		if (processingMode === 'single') {
			if (processedImageUrl) {
				URL.revokeObjectURL(processedImageUrl);
				processedImageUrl = null;
			}
			if (originalImageUrl && originalImageUrl.startsWith('blob:')) {
				URL.revokeObjectURL(originalImageUrl);
			}
			originalImageUrl = null;
			selectedFile = null;
		} else {
			// Clear batch results
			batchResults.forEach((result) => {
				URL.revokeObjectURL(result.originalUrl);
				if (result.processedUrl) {
					URL.revokeObjectURL(result.processedUrl);
				}
			});
			batchResults = [];
			selectedFiles = [];
		}
		error = false;
	}

	function switchMode(mode: 'single' | 'batch') {
		clearResults();
		processingMode = mode;
	}

	async function downloadBatchAsZip() {
		const zip = new JSZip();
		const successfulResults = batchResults.filter((r) => r.processedUrl && !r.error);

		for (let i = 0; i < successfulResults.length; i++) {
			const result = successfulResults[i];
			try {
				const response = await fetch(result.processedUrl!);
				const blob = await response.blob();
				const fileName = `${result.file.name.split('.')[0]}_bg_removed.png`;
				zip.file(fileName, blob);
			} catch (err) {
				console.error(`Failed to add ${result.file.name} to zip:`, err);
			}
		}

		const zipBlob = await zip.generateAsync({ type: 'blob' });
		const url = URL.createObjectURL(zipBlob);
		const link = document.createElement('a');
		link.href = url;
		link.download = 'background_removed_images.zip';
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
		URL.revokeObjectURL(url);
	}

	function retry() {
		error = false;
		if (!isModelLoaded) {
			loadModel();
		}
	}

	function handleModelChange(newModelId: string) {
		if (newModelId !== selectedModelId) {
			selectedModelId = newModelId;
			// Clear existing results
			clearResults();
			// Reset model state
			isModelLoaded = false;
			segmenter = null;
			// Load new model
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
		// Clean up batch results
		batchResults.forEach((result) => {
			URL.revokeObjectURL(result.originalUrl);
			if (result.processedUrl) {
				URL.revokeObjectURL(result.processedUrl);
			}
		});
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
		{/if}
	</div>
{:else}
	<div class="card-interface background-remover-interface">
		<div class="floating-decoration decoration-1"></div>
		<div class="floating-decoration decoration-2"></div>

		<div class="toolbar">
			<span class="model-info">
				<span class="model-emoji">🖼️</span>
				Background Remover ({AVAILABLE_MODELS.find((m) => m.id === selectedModelId)?.name})
			</span>
			<button onclick={clearResults} class="clear-btn" aria-label="Clear Results">
				<span class="btn-emoji">🗑️</span>
				Clear
			</button>
			<div class="toolbar-decoration"></div>
		</div>

		<div class="content-area">
			<!-- Model Selection -->
			{#if !isProcessing && !processedImageUrl && batchResults.length === 0}
				<div class="model-selection">
					<h3><span class="step-number">Step 1:</span> Model Selection</h3>
					<div class="model-buttons">
						{#each AVAILABLE_MODELS as modelOption (modelOption.id)}
							<button
								class="model-btn"
								class:active={selectedModelId === modelOption.id}
								onclick={() => handleModelChange(modelOption.id)}
								disabled={isLoadingModel}
							>
								<span class="model-name">{modelOption.name}</span>
								<span class="model-description">{modelOption.description}</span>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- Mode Selection -->
			{#if !isProcessing && !processedImageUrl && batchResults.length === 0}
				<div class="mode-selection">
					<h3><span class="step-number">Step 2:</span> Processing Mode</h3>
					<div class="mode-buttons">
						<button
							class="mode-btn"
							class:active={processingMode === 'single'}
							onclick={() => switchMode('single')}
						>
							<span class="mode-icon">🖼️</span>
							Single Image
						</button>
						<button
							class="mode-btn"
							class:active={processingMode === 'batch'}
							onclick={() => switchMode('batch')}
						>
							<span class="mode-icon">📁</span>
							Multiple images
						</button>
					</div>
				</div>
			{/if}

			{#if !isProcessing && !processedImageUrl && batchResults.length === 0}
				<div class="upload-selection">
					<h3><span class="step-number">Step 3:</span> Upload Images</h3>
					<BackgroundRemoverUpload
						mode={processingMode}
						{selectedFile}
						{selectedFiles}
						onFileSelect={handleSingleFileSelect}
						onFilesSelect={handleBatchFileSelect}
						onExampleUse={handleExampleUse}
						disabled={isProcessing}
					/>
				</div>
			{/if}

			{#if isProcessing}
				<BackgroundRemoverProgress
					progress={processingProgress}
					message={processingMode === 'single'
						? 'Processing image and removing background...'
						: `Processing image ${currentBatchIndex} of ${totalBatchCount}...`}
				/>
			{/if}

			{#if error}
				<ErrorDisplay message={errorMessage} buttonText="Try Again" onRetry={retry} />
			{/if}

			{#if processingMode === 'single' && processedImageUrl && originalImageUrl && !isProcessing}
				<BackgroundRemoverResult
					{originalImageUrl}
					{processedImageUrl}
					onProcessAnother={clearResults}
				/>
			{/if}

			{#if processingMode === 'batch' && batchResults.length > 0 && !isProcessing}
				<BackgroundRemoverBatchResult
					{batchResults}
					onProcessAnother={clearResults}
					onDownloadZip={downloadBatchAsZip}
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

	/* Mode Selection */
	.mode-selection {
		background: #fff;
		border: 4px solid #000;
		padding: 1.5rem;
		box-shadow: 6px 6px 0 #000;
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(-0.3deg);
		animation: slideIn 0.4s ease-out;
	}

	@keyframes slideIn {
		from {
			transform: translateY(10px) rotate(-0.3deg);
			opacity: 0;
		}
		to {
			transform: translateY(0) rotate(-0.3deg);
			opacity: 1;
		}
	}

	.mode-selection h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.5rem;
		color: #000;
		text-align: center;
		letter-spacing: 2px;
		text-transform: uppercase;
		background: #ffd93d;
		padding: 0.5rem 1rem;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		transform: rotate(1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.mode-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.mode-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem;
		background: #f0f0f0;
		border: 3px solid #000;
		border-radius: 8px;
		cursor: pointer;
		font-size: 1rem;
		font-weight: 700;
		transition: all 0.2s;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-shadow: 4px 4px 0 #000;
		min-width: 140px;
	}

	.mode-btn:hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
		background: #e0e0e0;
	}

	.mode-btn.active {
		background: #98fb98;
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
	}

	.mode-btn.active:hover {
		background: #90ee90;
	}

	.mode-icon {
		font-size: 2rem;
	}

	/* Model Selection */
	.model-selection {
		background: #fff;
		border: 4px solid #000;
		padding: 1.5rem;
		box-shadow: 6px 6px 0 #000;
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(0.2deg);
		animation: slideIn 0.4s ease-out;
	}

	.model-selection h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.5rem;
		color: #000;
		text-align: center;
		letter-spacing: 2px;
		text-transform: uppercase;
		background: #ff69b4;
		padding: 0.5rem 1rem;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		transform: rotate(-1deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	.model-buttons {
		display: flex;
		gap: 1rem;
		justify-content: center;
	}

	.model-btn {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 0.5rem;
		padding: 1.5rem;
		background: #f8f8f8;
		border: 3px solid #000;
		border-radius: 8px;
		cursor: pointer;
		font-size: 0.875rem;
		font-weight: 600;
		transition: all 0.2s;
		font-family: 'Space Grotesk', system-ui, sans-serif;
		box-shadow: 4px 4px 0 #000;
		min-width: 160px;
		text-align: center;
	}

	.model-btn:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}

	.model-btn:not(:disabled):hover {
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
		background: #e8e8e8;
	}

	.model-btn.active {
		background: #ffd93d;
		transform: translate(-2px, -2px);
		box-shadow: 6px 6px 0 #000;
	}

	.model-btn.active:not(:disabled):hover {
		background: #ffcc00;
	}

	.model-name {
		font-size: 1rem;
		font-weight: 700;
		text-transform: uppercase;
		letter-spacing: 0.5px;
		color: #000;
	}

	.model-description {
		font-size: 0.75rem;
		color: #666;
		text-transform: none;
		letter-spacing: 0;
		font-weight: 400;
		line-height: 1.2;
	}

	/* Step Numbers */
	.step-number {
		background: #000;
		color: #fff;
		padding: 0.25rem 0.5rem;
		border-radius: 4px;
		font-size: 0.875rem;
		font-weight: 700;
		margin-right: 0.5rem;
		display: inline-block;
		transform: rotate(0deg);
	}

	/* Upload Selection */
	.upload-selection {
		background: #fff;
		border: 4px solid #000;
		padding: 1.5rem;
		box-shadow: 6px 6px 0 #000;
		margin-bottom: 1.5rem;
		position: relative;
		transform: rotate(-0.1deg);
		animation: slideIn 0.4s ease-out;
	}

	.upload-selection h3 {
		margin-top: 0;
		margin-bottom: 1rem;
		font-family: 'Bebas Neue', sans-serif;
		font-size: 1.5rem;
		color: #000;
		text-align: center;
		letter-spacing: 2px;
		text-transform: uppercase;
		background: #98fb98;
		padding: 0.5rem 1rem;
		border: 3px solid #000;
		box-shadow: 4px 4px 0 #000;
		transform: rotate(0.5deg);
		width: fit-content;
		margin-left: auto;
		margin-right: auto;
	}

	@media (max-width: 600px) {
		.loading {
			align-items: stretch;
			margin: 1rem 0;
		}

		.clear-btn {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}

		.decoration-1,
		.decoration-2 {
			display: none;
		}

		.mode-buttons,
		.model-buttons {
			flex-direction: column;
			gap: 0.75rem;
		}

		.mode-btn,
		.model-btn {
			min-width: auto;
			width: 100%;
		}
	}

	@media (max-width: 400px) {
		.loading {
			margin: 0.5rem 0;
		}
	}
</style>
