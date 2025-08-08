<script lang="ts">
	import createModule from '@transcribe/shout';
	import { FileTranscriber } from '@transcribe/transcriber';
	import { downloadModelWithProgress, isModelCached, isOPFSSupported } from '$lib/download-utils';
	import { onMount, onDestroy } from 'svelte';
	import { whisperModel } from '$lib/stores';
	import { useWakeLock } from '$lib/wakeLock.svelte';
	
	// Import components
	import WhisperModelSelector from '$lib/components/whisper/WhisperModelSelector.svelte';
	import TranscribeOptions from '$lib/components/whisper/TranscribeOptions.svelte';
	import TranscriptionProgress from '$lib/components/whisper/TranscriptionProgress.svelte';
	import TranscriptionResult from '$lib/components/whisper/TranscriptionResult.svelte';

	// State variables
	let isReady = $state(false);
	let isLoading = $state(false);
	let isTranscribing = $state(false);
	let transcriber: FileTranscriber;
	let text = $state('');
	let error = $state(false);
	let transcribeProgress = $state(0);
	let previousProgress = $state(0);
	let downloadProgress = $state(0);
	let previousDownloadProgress = $state(0);
	let currentSegment = $state('');
	let usingCachedModel = $state(false);
	let opfsSupported = $state(true);
	let hasProgressTracking = $state(true);

	// Store full transcription data for formats
	let transcriptionData = $state<any>(null);

	// Initialize wake lock functionality
	const { requestWakeLock, releaseWakeLock, setupWakeLock } = useWakeLock();

	// Set up event listeners
	onMount(() => {
		// Set up wake lock management
		return setupWakeLock(() => isTranscribing);
	});

	// File upload state
	let selectedFile: File | null = $state(null);
	let transcribeMode = $state<'demo' | 'upload'>('upload');

	// Timeout tracking for stuck transcription
	let lastSegmentTime = $state(0);
	let stuckCheckInterval: number | null = null;
	let isStuck = $state(false);

	const DEFAULT_MODEL = 'https://files.khromov.se/whisper/ggml-tiny-q5_1.bin';

	// Model selection state
	let selectedModel = $state($whisperModel || DEFAULT_MODEL);
	const availableModels = [
		{ path: DEFAULT_MODEL, name: 'Whisper Tiny (q5_1)' },
		{
			path: 'https://files.khromov.se/whisper/ggml-tiny.en-q5_1.bin',
			name: 'Whisper Tiny English (q5_1)'
		},
		{ path: 'https://files.khromov.se/whisper/ggml-small-q5_1.bin', name: 'Whisper Small (q5_1)' },
		{
			path: 'https://files.khromov.se/whisper/ggml-small.en-q5_1.bin',
			name: 'Whisper Small English (q5_1)'
		},
		{
			path: 'https://files.khromov.se/whisper/ggml-medium-q5_0.bin',
			name: 'Whisper Medium (q5_0)'
		},
		{
			path: 'https://files.khromov.se/whisper/ggml-medium.en-q5_0.bin',
			name: 'Whisper Medium English (q5_0)'
		},
		{
			path: 'https://files.khromov.se/whisper/ggml-large-v2-q5_0.bin',
			name: 'Whisper Large (q5_0)'
		}
	];

	async function transcribe() {
		if (!transcriber?.isReady) return;
		if (transcribeMode === 'upload' && !selectedFile) return;

		text = '';
		currentSegment = '';
		isTranscribing = true;
		transcribeProgress = 0;
		previousProgress = 0;
		isStuck = false;
		lastSegmentTime = Date.now();
		transcriptionData = null;

		// Start checking for stuck transcription
		startStuckCheck();

		// Request wake lock to keep screen on during transcription
		await requestWakeLock();

		try {
			let result;
			if (transcribeMode === 'demo') {
				// Transcribe the demo file
				result = await transcriber.transcribe('/jfk.mp3', { lang: 'en' });
			} else {
				// Transcribe the uploaded file
				result = await transcriber.transcribe(selectedFile!, { lang: 'en' });
			}

			// Store the full result for different formats
			transcriptionData = result;

			// Extract the transcription text
			text = result.transcription.map((t: any) => t.text).join(' ');
		} catch (err) {
			console.error('Transcription error:', err);
			error = true;
			text = 'An error occurred during transcription. Please try again.';
		} finally {
			isTranscribing = false;
			transcribeProgress = 0;
			currentSegment = '';
			stopStuckCheck();

			// Release wake lock when done
			await releaseWakeLock();
		}
	}

	function startStuckCheck() {
		stuckCheckInterval = window.setInterval(() => {
			if (isTranscribing && Date.now() - lastSegmentTime > 60000) {
				isStuck = true;
				stopStuckCheck();
			}
		}, 5000); // Check every 5 seconds
	}

	function stopStuckCheck() {
		if (stuckCheckInterval) {
			clearInterval(stuckCheckInterval);
			stuckCheckInterval = null;
		}
	}

	function reloadPage() {
		window.location.reload();
	}

	function retry() {
		error = false;
		loadModel();
	}

	function handleFileSelect(file: File) {
		selectedFile = file;
		transcribeMode = 'upload';
	}

	function handleModeChange(mode: 'demo' | 'upload') {
		transcribeMode = mode;
		if (mode === 'demo') {
			selectedFile = null;
		}
	}

	async function loadModel() {
		try {
			isLoading = true;
			error = false;

			// If there's already a transcriber loaded, clean it up first
			if (transcriber) {
				transcriber.destroy();
				isReady = false;
			}

			// Save the selected model to the store
			$whisperModel = selectedModel;

			console.log(`Loading model from: ${selectedModel}`);

			// Reset state
			usingCachedModel = false;
			downloadProgress = 0;
			hasProgressTracking = true;

			// Download the model with real progress tracking
			const modelFile = await downloadModelWithProgress(selectedModel, (progress, cached) => {
				previousDownloadProgress = downloadProgress;
				downloadProgress = progress;
				
				// Check for no progress tracking signal
				if (progress === -1) {
					hasProgressTracking = false;
					downloadProgress = 0;
					return;
				}
				
				// Update cached state
				if (cached) {
					usingCachedModel = true;
				}
			});

			// Create new instance with progress tracking
			transcriber = new FileTranscriber({
				createModule,
				model: modelFile, // Pass the downloaded File object instead of URL
				onReady: () => console.log('Transcriber ready'),
				onProgress: (progress) => {
					previousProgress = transcribeProgress;
					transcribeProgress = Math.round(progress);
					console.log(`Transcription progress: ${transcribeProgress}%`);
				},
				onSegment: (segment) => {
					console.log('New segment:', segment);
					// Update the current segment preview and reset timer
					currentSegment = segment.segment.text.trim();
					lastSegmentTime = Date.now();
					isStuck = false;
				},
				onComplete: (result) => console.log('Transcription complete:', result),
				onCanceled: () => console.log('Transcription canceled')
			});

			// Initialize the transcriber
			await transcriber.init();

			isReady = true;
		} catch (err) {
			console.error('Failed to initialize transcriber:', err);
			error = true;
		} finally {
			isLoading = false;
		}
	}

	// Function to change the model once one is already loaded
	function changeModel() {
		// This will trigger the loadModel function with the currently selected model
		isReady = false;
		loadModel();
	}

	// Load saved model on mount
	onMount(async () => {
		// Check OPFS support
		opfsSupported = isOPFSSupported();
		if (!opfsSupported) {
			console.log('OPFS not supported - models will not be cached');
		}
		
		// If we have a saved model, only load it if it's cached (or if OPFS not supported, don't autoload)
		if ($whisperModel) {
			selectedModel = $whisperModel;
			
			if (opfsSupported) {
				// Only autoload if the model is already cached
				const cached = await isModelCached($whisperModel);
				if (cached) {
					console.log('Autoloading cached model:', $whisperModel);
					loadModel();
				} else {
					console.log('Model not cached, user must manually load:', $whisperModel);
				}
			} else {
				console.log('OPFS not supported, user must manually load model:', $whisperModel);
			}
		}
	});

	// Clean up resources when component is destroyed
	onDestroy(() => {
		if (transcriber) {
			transcriber.destroy();
		}
		stopStuckCheck();
	});
</script>

<div class="card-interface" style="animation: fadeIn 0.5s ease-out;">
	<div class="toolbar">
		<span class="model-info">Whisper Audio Transcription</span>
	</div>

	<div class="content-area">
		<!-- Model Selection Section -->
		<WhisperModelSelector
			bind:selectedModel
			{availableModels}
			{isLoading}
			{isReady}
			{error}
			{downloadProgress}
			{previousDownloadProgress}
			{usingCachedModel}
			{hasProgressTracking}
			onLoadModel={loadModel}
			onChangeModel={changeModel}
			onRetry={retry}
		/>

		<!-- Main Content (grayed out when model not ready) -->
		<div class="main-content" class:disabled={!isReady}>
			<TranscribeOptions
				bind:transcribeMode
				bind:selectedFile
				onFileSelect={handleFileSelect}
				onModeChange={handleModeChange}
				disabled={!isReady}
			/>

			{#if isTranscribing}
				<TranscriptionProgress
					progress={transcribeProgress}
					previousProgress={previousProgress}
					{currentSegment}
					{isStuck}
					onReload={reloadPage}
				/>
			{:else if text}
				<TranscriptionResult
					{text}
					{transcriptionData}
				/>
			{/if}
		</div>
	</div>

	<div class="input-area" class:disabled={!isReady}>
		<button
			onclick={transcribe}
			disabled={!isReady || isTranscribing || (transcribeMode === 'upload' && !selectedFile)}
			class="transcribe-btn primary-button"
		>
			{isTranscribing ? 'Transcribing...' : 'Start Transcription'}
		</button>

		<div class="disclaimer">
			Transcription is performed locally in your browser. Results may not always be accurate.
		</div>
	</div>
</div>

<style>
	.main-content.disabled,
	.input-area.disabled {
		opacity: 0.3;
		pointer-events: none;
	}

	.transcribe-btn {
		margin: 0 auto;
		display: block;
		min-width: 250px;
		text-align: center;
	}

	.transcribe-btn:disabled {
		background-color: #b0b0b0;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.primary-button {
		padding: 0.875rem 1.5rem;
		background-color: #0071e3;
		color: white;
		border: none;
		border-radius: 14px;
		cursor: pointer;
		font-size: 1.125rem;
		font-weight: 500;
		transition: all 0.2s;
		box-shadow: 0 2px 8px rgba(0, 113, 227, 0.3);
	}

	.primary-button:hover {
		background-color: #0062cc;
		transform: translateY(-1px);
		box-shadow: 0 4px 12px rgba(0, 113, 227, 0.4);
	}

	.primary-button:active {
		transform: translateY(0);
		box-shadow: 0 1px 3px rgba(0, 113, 227, 0.3);
	}

	.primary-button:disabled {
		background-color: #b0b0b0;
		cursor: not-allowed;
		transform: none;
		box-shadow: none;
	}

	.disclaimer {
		margin-top: 0.375rem;
		font-size: 0.8125rem;
		color: #8e8e93;
		text-align: center;
	}

	/* Fade-in animation */
	@keyframes fadeIn {
		from {
			opacity: 0;
			transform: translateY(10px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	/* Responsive adjustments */
	@media (max-width: 600px) {
		.main-content.disabled,
		.input-area.disabled {
			opacity: 0.3;
			pointer-events: none;
		}
	}
</style>
